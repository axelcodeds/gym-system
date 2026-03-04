package com.gym.controller;

import com.gym.dto.request.RegisterRequest;
import com.gym.dto.request.UpdateUserRequest;
import com.gym.dto.response.DashboardStatsResponse;
import com.gym.dto.response.UserResponse;
import com.gym.entity.enums.MembershipStatus;
import com.gym.service.MemberService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Configure properly for production
public class MemberController {

    private final MemberService memberService;

    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllMembers() {
        List<UserResponse> members = memberService.getAllMembers();
        return ResponseEntity.ok(members);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getMemberById(@PathVariable String id) {
        UserResponse member = memberService.getMemberById(id);
        return ResponseEntity.ok(member);
    }

    @GetMapping("/search")
    public ResponseEntity<List<UserResponse>> searchMembers(@RequestParam String query) {
        List<UserResponse> members = memberService.searchMembers(query);
        return ResponseEntity.ok(members);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<UserResponse>> getMembersByStatus(@PathVariable MembershipStatus status) {
        List<UserResponse> members = memberService.getMembersByStatus(status);
        return ResponseEntity.ok(members);
    }

    @PostMapping
    public ResponseEntity<UserResponse> createMember(@Valid @RequestBody RegisterRequest request) {
        UserResponse member = memberService.createMember(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(member);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> updateMember(
            @PathVariable String id,
            @Valid @RequestBody UpdateUserRequest request) {
        UserResponse member = memberService.updateMember(id, request);
        return ResponseEntity.ok(member);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMember(@PathVariable String id) {
        memberService.deleteMember(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/dashboard/stats")
    public ResponseEntity<DashboardStatsResponse> getDashboardStats() {
        DashboardStatsResponse stats = memberService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }
}
