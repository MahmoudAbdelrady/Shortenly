package com.mdevs.shortenly.repository;

import com.mdevs.shortenly.dto.ShortLinkStatistics;
import com.mdevs.shortenly.entity.ShortLink;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface ShortLinkRepository extends JpaRepository<ShortLink, Long> {

    Optional<ShortLink> findByCode(String code);

    Optional<ShortLink> findByUuid(String uuid);

    @Query("""
        SELECT new com.mdevs.shortenly.dto.ShortLinkStatistics(
            COUNT(s),
            SUM(CASE WHEN s.expiresAt IS NULL OR s.expiresAt >= CURRENT_TIMESTAMP THEN 1L ELSE 0L END),
            SUM(CASE WHEN s.expiresAt IS NOT NULL AND s.expiresAt < CURRENT_TIMESTAMP THEN 1L ELSE 0L END)
        ) FROM ShortLink s
        """)
    ShortLinkStatistics getStatistics();
}
