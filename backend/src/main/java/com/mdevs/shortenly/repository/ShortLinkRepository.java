package com.mdevs.shortenly.repository;

import com.mdevs.shortenly.entity.ShortLink;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ShortLinkRepository extends JpaRepository<ShortLink, Long> {

    Optional<ShortLink> findByCode(String code);

    @Query("""
            SELECT s FROM ShortLink s
            WHERE (:url IS NULL OR s.originalUrl LIKE CONCAT('%', :url, '%'))
            AND (:isActive IS NULL
                OR (:isActive = TRUE AND (s.expiresAt IS NULL OR s.expiresAt > CURRENT_TIMESTAMP))
                OR (:isActive = FALSE AND s.expiresAt IS NOT NULL AND s.expiresAt <= CURRENT_TIMESTAMP))
            ORDER BY s.id DESC
            """)
    Page<ShortLink> searchLinks(@Param("url") String url, @Param("isActive") Boolean isActive, Pageable pageable);
}
