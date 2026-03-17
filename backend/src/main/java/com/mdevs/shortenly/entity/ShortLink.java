package com.mdevs.shortenly.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "short_links", indexes = {
        @Index(name = "idx_expiry_type", columnList = "expiryType"),
        @Index(name = "idx_original_url", columnList = "originalUrl")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShortLink {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, updatable = false)
    private String uuid;

    @CreationTimestamp
    @Column(updatable = false, columnDefinition = "TIMESTAMP(0)")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(columnDefinition = "TIMESTAMP(0)")
    private LocalDateTime updatedAt;

    @Column(nullable = false)
    private String originalUrl;

    @Column(nullable = false, unique = true)
    private String code;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ExpiryType expiryType;

    @Builder.Default
    private Long clicks = 0L;

    @Column(columnDefinition = "TIMESTAMP(0)")
    private LocalDateTime expiresAt;

    @PrePersist
    private void generateUuid() {
        if (uuid == null) {
            uuid = UUID.randomUUID().toString();
        }
    }

    @Transient
    public boolean isExpired() {
        return expiresAt != null && LocalDateTime.now().isAfter(expiresAt);
    }
}
