package com.mdevs.shortenly.repository;

import com.mdevs.shortenly.entity.ShortLink;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ShortLinkRepository extends JpaRepository<ShortLink, Long> {

    Optional<ShortLink> findByCode(String code);

    Optional<ShortLink> findByUuid(String uuid);
}
