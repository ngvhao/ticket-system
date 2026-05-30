const FEATURES = [
  {
    title: "Danh sách sự kiện",
    description:
      "Duyệt các sự kiện đang mở bán, xem thời gian, địa điểm và số vé còn lại theo thời gian thực từ API.",
    step: "01",
  },
  {
    title: "Đặt vé qua hàng đợi",
    description:
      "Gửi yêu cầu đặt vé vào BullMQ queue. Hệ thống xử lý tuần tự, tránh oversell khi nhiều người đặt cùng lúc.",
    step: "02",
  },
  {
    title: "Thông báo realtime",
    description:
      "Theo dõi trạng thái booking qua WebSocket — nhận kết quả ngay khi job hoàn tất, không cần reload trang.",
    step: "03",
  },
] as const;

export function FeatureGrid() {
  return (
    <section aria-labelledby="features-heading">
      <div className="mb-8">
        <p className="eyebrow">Tính năng</p>
        <h2 id="features-heading" className="headline mt-2">
          Quy trình đặt vé end-to-end
        </h2>
        <p className="body-lg mt-3 max-w-2xl">
          Từ chọn sự kiện đến xác nhận vé — mọi bước được thiết kế rõ ràng trên
          nền dark canvas.
        </p>
      </div>

      <ul className="grid gap-4 md:grid-cols-3">
        {FEATURES.map((feature) => (
          <li key={feature.step} className="feature-card">
            <span className="caption font-mono text-[var(--color-ink-tertiary)]">
              {feature.step}
            </span>
            <h3 className="card-title mt-3 text-lg">{feature.title}</h3>
            <p className="body-sm mt-2">{feature.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
