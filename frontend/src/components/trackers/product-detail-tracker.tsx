"use client";

import { useEffect, useRef } from "react";
import { useUserSession } from "@/hooks/useUserSession";
import { useAddUserInteraction } from "@/hooks/useAddUserInteraction";
import { Role } from "@/common/enums";

export default function ProductDetailTracker({
  productId,
}: {
  productId: string;
}) {
  const { data: sessionData } = useUserSession();
  const addUserInteractionMutation = useAddUserInteraction();

  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;

    if (!sessionData?.session_user.user_id) return;
    if (sessionData.session_user.user.roleId !== Role.USER) return;
    if (!productId) return;

    hasRun.current = true;

    addUserInteractionMutation.mutate({
      productId,
      userId: sessionData?.session_user.user_id,
      action: "VIEW",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, sessionData]);

  return null;
}
