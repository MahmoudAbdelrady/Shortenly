package com.mdevs.shortenly.service;

import com.mdevs.shortenly.dto.ShortLinkRecord;
import com.mdevs.shortenly.dto.ShortLinkRequest;
import com.mdevs.shortenly.dto.ShortLinkResult;
import com.mdevs.shortenly.dto.ShortLinkSearch;
import com.mdevs.shortenly.entity.ExpiryType;
import com.mdevs.shortenly.entity.ShortLink;
import com.mdevs.shortenly.exception.ShortLinkExpiredException;
import com.mdevs.shortenly.exception.ShortLinkNotFoundException;
import com.mdevs.shortenly.repository.ShortLinkRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ShortLinkService {

    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM-dd hh:mm:ss");

    private final ShortLinkRepository shortLinkRepository;

    @Value("${app.base-url}")
    private String baseUrl;

    public Page<ShortLinkRecord> searchLinks(ShortLinkSearch search, Pageable pageable) {
        Page<ShortLink> page = shortLinkRepository.searchLinks(search.url(), search.isActive(), pageable);

        return page.map(link -> new ShortLinkRecord(
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

        shortLink.setClicks(shortLink.getClicks() + 1);
        shortLinkRepository.save(shortLink);

        return shortLink.getOriginalUrl();
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
