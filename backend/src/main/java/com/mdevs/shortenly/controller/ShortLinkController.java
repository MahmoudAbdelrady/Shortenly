package com.mdevs.shortenly.controller;

import com.mdevs.shortenly.dto.ShortLinkRecord;
import com.mdevs.shortenly.dto.ShortLinkRequest;
import com.mdevs.shortenly.dto.ShortLinkResult;
import com.mdevs.shortenly.dto.ShortLinkSearch;
import com.mdevs.shortenly.service.ShortLinkService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/short-links")
@RequiredArgsConstructor
public class ShortLinkController {

    private final ShortLinkService shortLinkService;

    @GetMapping
    public ResponseEntity<Page<ShortLinkRecord>> searchLinks(@ModelAttribute ShortLinkSearch search, Pageable pageable) {
        return ResponseEntity.ok(shortLinkService.searchLinks(search, pageable));
    }

    @PostMapping
    public ResponseEntity<ShortLinkResult> create(@Valid @RequestBody ShortLinkRequest request) {
        return new ResponseEntity<>(shortLinkService.create(request), HttpStatus.CREATED);
    }
}
