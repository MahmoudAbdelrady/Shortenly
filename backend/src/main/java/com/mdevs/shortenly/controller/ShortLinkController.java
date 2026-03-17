package com.mdevs.shortenly.controller;

import com.mdevs.shortenly.dto.ShortLinkRecord;
import com.mdevs.shortenly.dto.ShortLinkRequest;
import com.mdevs.shortenly.dto.ShortLinkResult;
import com.mdevs.shortenly.dto.ShortLinkSearch;
import com.mdevs.shortenly.dto.ShortLinkStatistics;
import com.mdevs.shortenly.service.ShortLinkService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequestMapping("/short-links")
@RequiredArgsConstructor
public class ShortLinkController {

    private final ShortLinkService shortLinkService;

    @GetMapping("/{code}/redirect")
    public ResponseEntity<Void> redirect(@PathVariable String code) {
        String originalUrl = shortLinkService.getOriginalUrl(code);
        return ResponseEntity.status(HttpStatus.FOUND)
                .location(URI.create(originalUrl))
                .build();
    }

    @GetMapping("/statistics")
    public ResponseEntity<ShortLinkStatistics> statistics() {
        return ResponseEntity.ok(shortLinkService.getStatistics());
    }

    @GetMapping
    public ResponseEntity<Page<ShortLinkRecord>> searchLinks(@ModelAttribute ShortLinkSearch search, Pageable pageable) {
        return ResponseEntity.ok(shortLinkService.searchLinks(search, pageable));
    }

    @PostMapping
    public ResponseEntity<ShortLinkResult> create(@Valid @RequestBody ShortLinkRequest request) {
        return new ResponseEntity<>(shortLinkService.create(request), HttpStatus.CREATED);
    }

    @PatchMapping("/{uuid}/deactivate")
    public ResponseEntity<ShortLinkRecord> deactivate(@PathVariable String uuid) {
        return ResponseEntity.ok(shortLinkService.deactivate(uuid));
    }
}
