package com.mdevs.shortenly.service;

import com.mdevs.shortenly.dto.ShortLinkRecord;
import com.mdevs.shortenly.dto.ShortLinkRequest;
import com.mdevs.shortenly.dto.ShortLinkResult;
import com.mdevs.shortenly.dto.ShortLinkSearch;
import com.mdevs.shortenly.dto.ShortLinkStatistics;
import com.mdevs.shortenly.entity.ExpiryType;
import com.mdevs.shortenly.entity.ShortLink;
import com.mdevs.shortenly.exception.ShortLinkCannotExpireException;
import com.mdevs.shortenly.exception.ShortLinkExpiredException;
import com.mdevs.shortenly.exception.ShortLinkNotFoundException;
import com.mdevs.shortenly.repository.ShortLinkRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class ShortLinkService {

    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM-dd hh:mm:ss");

    private final ShortLinkRepository shortLinkRepository;
    private final EntityManager em;

    @Value("${app.base-url}")
    private String baseUrl;

    public ShortLinkStatistics getStatistics() {
        return shortLinkRepository.getStatistics();
    }

    public Page<ShortLinkRecord> searchLinks(ShortLinkSearch search, Pageable pageable) {
        Map<String, Object> params = new HashMap<>();
        String queryBody = buildSearchQuery(search, params);

        TypedQuery<ShortLink> dataQuery = em.createQuery("SELECT s " + queryBody + " ORDER BY s.id DESC", ShortLink.class);
        params.forEach(dataQuery::setParameter);
        dataQuery.setFirstResult((int) pageable.getOffset());
        dataQuery.setMaxResults(pageable.getPageSize());

        TypedQuery<Long> countQuery = em.createQuery("SELECT COUNT(s) " + queryBody, Long.class);
        params.forEach(countQuery::setParameter);
        long total = countQuery.getSingleResult();

        Page<ShortLink> page = new PageImpl<>(dataQuery.getResultList(), pageable, total);

        return page.map(link -> new ShortLinkRecord(
                link.getUuid(),
                link.getOriginalUrl(),
                baseUrl + link.getCode(),
                link.getClicks(),
                formatDateTime(link.getCreatedAt()),
                link.getExpiryType().getValue(),
                formatDateTime(link.getExpiresAt()),
                link.isExpired()
        ));
    }

    public ShortLinkResult create(ShortLinkRequest request) {
        ExpiryType expiryType = ExpiryType.fromValue(request.expiryType());
        ShortLink shortLink = ShortLink.builder()
                .originalUrl(request.url())
                .code(generateUniqueCode())
                .expiryType(expiryType)
                .expiresAt(expiryType.getMinutes() == null ? null : LocalDateTime.now().plusMinutes(expiryType.getMinutes()))
                .build();
        shortLinkRepository.save(shortLink);

        return new ShortLinkResult(
                baseUrl + shortLink.getCode(),
                shortLink.getOriginalUrl(),
                expiryType.getValue(),
                shortLink.getExpiresAt()
        );
    }

    public String getOriginalUrl(String code) {
        ShortLink shortLink = shortLinkRepository.findByCode(code).orElseThrow(() -> new ShortLinkNotFoundException(code));

        if (shortLink.isExpired()) {
            throw new ShortLinkExpiredException(code);
        }

        if (shortLink.getExpiryType().equals(ExpiryType.ONE_TIME)) {
            shortLink.setExpiresAt(LocalDateTime.now().minusYears(1)); // Mark as expired
        }
        shortLink.setClicks(shortLink.getClicks() + 1);
        shortLinkRepository.save(shortLink);

        return shortLink.getOriginalUrl();
    }

    public ShortLinkRecord deactivate(String uuid) {
        ShortLink link = shortLinkRepository.findByUuid(uuid).orElseThrow(() -> new ShortLinkNotFoundException(uuid));

        if (link.getExpiryType().equals(ExpiryType.NEVER_EXPIRES)) {
            throw new ShortLinkCannotExpireException("Cannot expire a link with NEVER_EXPIRES type");
        }

        if (link.isExpired()) {
            throw new ShortLinkCannotExpireException("Link is already expired");
        }

        link.setExpiresAt(LocalDateTime.now().minusYears(1));
        shortLinkRepository.save(link);

        return new ShortLinkRecord(
                link.getUuid(),
                link.getOriginalUrl(),
                baseUrl + link.getCode(),
                link.getClicks(),
                formatDateTime(link.getCreatedAt()),
                link.getExpiryType().getValue(),
                formatDateTime(link.getExpiresAt()),
                link.isExpired()
        );
    }

    private String buildSearchQuery(ShortLinkSearch search, Map<String, Object> params) {
        StringBuilder jpql = new StringBuilder("FROM ShortLink s WHERE 1=1");

        if (search.url() != null) {
            jpql.append(" AND s.originalUrl LIKE :url");
            params.put("url", "%" + search.url() + "%");
        }

        if (search.isActive() != null) {
            if (search.isActive()) {
                jpql.append(" AND (s.expiresAt IS NULL OR s.expiresAt > :now)");
            } else {
                jpql.append(" AND s.expiresAt IS NOT NULL AND s.expiresAt <= :now");
            }
            params.put("now", LocalDateTime.now());
        }

        return jpql.toString();
    }

    private String formatDateTime(LocalDateTime dateTime) {
        if (dateTime == null) return null;
        return dateTime.format(DATE_FORMAT);
    }

    private String generateUniqueCode() {
        String code;
        do {
            code = UUID.randomUUID().toString().replace("-", "").substring(0, 8);
        } while (shortLinkRepository.findByCode(code).isPresent());
        return code;
    }
}
