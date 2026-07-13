interface StatCardProps {
  title: string;
  value: string;
  trend: string;
}

export default function StatCard({ title, value, trend }: StatCardProps) {
  return (
    <div className="card">
      <p className="card-label">{title}</p>
      <p className="card-value">{value}</p>
      <p className="card-trend">{trend}</p>
    </div>
  );
}
