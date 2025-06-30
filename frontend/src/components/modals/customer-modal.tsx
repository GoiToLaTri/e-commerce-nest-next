"use client";

import { Avatar, Button, Divider, Modal } from "antd";
import Link from "next/link";
import { useState } from "react";
import "@/styles/admin-modal.style.css";
import { useSignout } from "@/hooks/useSignout";
import { sonnerLoading } from "../sonner/sonner";
import { useRouter } from "next/navigation";

export interface CustomerModalProps {
  data: { session_user: IUserSession };
}

export function CustomerModal({ data }: CustomerModalProps) {
  const signoutMutation = useSignout();
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalClose, setIsModalClose] = useState<boolean>(false);
  const showModal = () => {
    setIsModalOpen(true);
    setIsModalClose(false);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    setIsModalClose(true);
  };

  const handleCancel = () => {
    setTimeout(() => setIsModalOpen(false), 120);
    setIsModalClose(true);
  };

  const handleSignout = async () => {
    sonnerLoading(
      signoutMutation
        .mutateAsync()
        .then(() => {
          router.refresh();
          return { message: "Sign out success" };
        })
        .catch((error) => {
          throw error.response.data.message || "Stock adjustment failed!";
        })
    );
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          type="text"
          className={`!text-[1rem] !rounded-[4rem] !h-fit !w-fit !px-0`}
          onClick={showModal}
        >
          <Avatar
            src={data.session_user.user.avatar}
            size={40}
            style={{ backgroundColor: "#fff" }}
          />
        </Button>
      </div>
      <Modal
        title={`${data.session_user.user.first_name} ${data.session_user.user.last_name}`}
        closable={{ "aria-label": "Custom Close Button" }}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        width={400}
        centered
        transitionName=""
        maskTransitionName=""
        wrapClassName="custom-modal-wrapper"
        modalRender={(modal) => (
          <div
            className={`custom-modal-content ${
              isModalClose ? "modal-close-animation" : "modal-open-animation"
            }`}
          >
            {modal}
          </div>
        )}
      >
        <div className="mt-8">
          <Link href={"/customer/shopping-cart"}>
            <Button
              type="text"
              className="!bg-transparent w-full !border-0 !rounded-lg !text-base !font-medium hover:!bg-[rgba(255,255,255,.04)] hover:!text-blue-600 hover:!border-0 transition"
              size="large"
            >
              Shopping cart
            </Button>
          </Link>
          <Link href={"/customer/order"}>
            <Button
              type="text"
              className="!bg-transparent w-full !border-0 !rounded-lg !text-base !font-medium hover:!bg-[rgba(255,255,255,.04)] hover:!text-blue-600 hover:!border-0 transition"
              size="large"
            >
              Order
            </Button>
          </Link>
          <Divider />
          <Button
            type="text"
            className="!bg-transparent w-full !border-0 !rounded-lg !text-base !font-medium hover:!bg-[rgba(255,255,255,.04)] hover:!text-blue-600 hover:!border-0 transition"
            size="large"
            onClick={handleSignout}
          >
            Sign out
          </Button>
        </div>
      </Modal>
    </>
  );
}
