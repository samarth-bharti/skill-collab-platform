package com.skillcollab.platform.domain;

import java.util.UUID;

public final class EntityIds {

    private EntityIds() {
    }

    public static String next(String prefix) {
        return prefix + "-" + UUID.randomUUID().toString().replace("-", "").substring(0, 12);
    }
}
