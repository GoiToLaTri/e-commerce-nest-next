"use client";

import { Button, Form, Input, Modal, Rate } from "antd";
import { useState } from "react";
import "@/styles/admin-modal.style.css";
import { CreateReviewPayload } from "@/models";
import { useCreateReview } from "@/hooks/useCreateReview";
import { sonnerError, sonnerLoading } from "../sonner/sonner";
const { TextArea } = Input;

export interface AddReviewModalProps {
  data: Partial<CreateReviewPayload>;
}

export function AddReviewModal({ data }: AddReviewModalProps) {
  const createReviewMutation = useCreateReview();
  const [form] = Form.useForm();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [formValues, setFormValues] = useState<CreateReviewPayload>();
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

  const onCreate = (values: CreateReviewPayload) => {
    if (
      !data.userId ||
      !data.customerName ||
      !data.productId ||
      !data.productName
    ) {
      sonnerError("Create review failed");
      return;
    }

    const payload: CreateReviewPayload = {
      ...values,
      userId: data.userId,
      customerName: data.customerName,
      productId: data.productId,
      productName: data.productName,
    };
    console.log("Received values of form: ", payload);
    sonnerLoading(
      createReviewMutation
        .mutateAsync({ payload })
        .then((message) => ({ message }))
        .catch((error) => {
          throw error.response.data.message || "Create review failed!";
        })
    );

    setFormValues(values);
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          type="primary"
          className="!bg-[#924dff] leading-[1.6] !py-[0.75rem] hover:!bg-[#7b3edc] transition-colors duration-300"
          onClick={showModal}
        >
          Add review
        </Button>
      </div>
      <Modal
        title={`Add review`}
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
        destroyOnHidden
        modalRender={(modal) => (
          <div
            className={`custom-modal-content ${
              isModalClose ? "modal-close-animation" : "modal-open-animation"
            }`}
          >
            <Form
              layout="vertical"
              form={form}
              name="form_in_modal"
              initialValues={{ modifier: "public" }}
              clearOnDestroy
              onFinish={(values) => onCreate(values)}
            >
              {modal}
            </Form>
          </div>
        )}
      >
        <div className="mt-8">
          <Form.Item
            name="rating"
            label="Rate"
            rules={[{ required: true, message: "Please provide a rating" }]}
          >
            <Rate allowHalf />
          </Form.Item>
          <Form.Item name="title" label="Title">
            <Input placeholder="Enter title" />
          </Form.Item>
          <Form.Item name="content" label="Content">
            <TextArea placeholder="Enter content" />
          </Form.Item>
          <Form.Item>
            <Button
              type="text"
              htmlType="submit"
              className="!bg-[#924dff] !border-0 !rounded-lg !text-base !font-medium hover:!bg-[#7b3edc] hover:!border-0 transition mr-2"
            >
              Send
            </Button>
            <Button
              type="text"
              className="!bg-transparent !border-0 !rounded-lg !text-base !font-medium hover:!bg-[rgba(255,255,255,.04)] hover:!text-blue-600 hover:!border-0 transition"
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </Form.Item>
        </div>
      </Modal>
    </>
  );
}
