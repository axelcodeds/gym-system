package com.gym.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStatsResponse {

    private long totalMembers;
    private long activeMembers;
    private long expiredMembers;
    private long inactiveMembers;
    private long activeSubscriptions;
    private long totalRevenue;
}
