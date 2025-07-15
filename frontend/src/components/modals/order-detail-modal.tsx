import { useOrder } from "@/hooks/useOrder";
import { convertNumberToCurrency } from "@/utils/currency.util";
import { formatDate } from "@/utils/date.util";
import { Button, Descriptions, Modal, Skeleton } from "antd";
import React, { useState } from "react";

export interface OrderDetailModalModalProps {
  id: string;
}

export default function OrderDetailModal({ id }: OrderDetailModalModalProps) {
  const { data, isLoading } = useOrder(id);
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

  console.log(data);

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          type="text"
          className="!bg-[#924dff] leading-[1.6] !py-[0.75rem] hover:!bg-[#7b3edc] transition-colors duration-300"
          onClick={showModal}
        >
          Detail
        </Button>
      </div>
      <Modal
        title={`Order detail`}
        closable={{ "aria-label": "Custom Close Button" }}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        width={600}
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
          {isLoading && <Skeleton />}
          {data && (
            <div>
              <Descriptions
                title="Information"
                column={2}
                styles={{
                  label: { fontSize: "16px" },
                  content: { fontSize: "16px" },
                }}
              >
                <Descriptions.Item label="Id">
                  {data.id || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Payment status">
                  {data.paymentStatus || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Order status">
                  {data.orderStatus || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Amount">
                  {convertNumberToCurrency(data.totalAmount)}
                </Descriptions.Item>
                <Descriptions.Item label="Created at">
                  {formatDate(new Date(data.createdAt))}
                </Descriptions.Item>
                <Descriptions.Item label="Updated at">
                  {formatDate(new Date(data.updatedAt))}
                </Descriptions.Item>
              </Descriptions>
              <Descriptions
                title="Detail"
                column={1}
                style={{
                  marginTop: "2rem",
                }}
                styles={{
                  label: { fontSize: "16px" },
                  content: { fontSize: "16px" },
                }}
              >
                {data.products &&
                  data.products.length > 0 &&
                  data.products.map((product, index) => (
                    <Descriptions.Item
                      key={product.model + "-" + index}
                      label={`Product ${index + 1}`}
                    >
                      {`x${product.quantity} ${
                        product.model
                      } - ${convertNumberToCurrency(product.price)}`}
                    </Descriptions.Item>
                  ))}
              </Descriptions>
              <Descriptions
                title="Shipping"
                column={2}
                style={{
                  marginTop: "2rem",
                }}
                styles={{
                  label: { fontSize: "16px" },
                  content: { fontSize: "16px" },
                }}
              >
                <Descriptions.Item label="Client">
                  {data.shippingInfo.fullName}
                </Descriptions.Item>
                <Descriptions.Item label="Delivery method">
                  {data.shippingInfo.delivery}
                </Descriptions.Item>
                <Descriptions.Item label="Phone">
                  {data.shippingInfo.phone}
                </Descriptions.Item>
                <Descriptions.Item label="Shipping fee">
                  {convertNumberToCurrency(data.shippingInfo.shippingfee)}
                </Descriptions.Item>
                <Descriptions.Item label="Address">
                  {data.shippingInfo.address}
                </Descriptions.Item>
              </Descriptions>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
