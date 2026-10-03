type ProgressPanelProps = {
  accepted: boolean;
  completed: boolean;
  onAccept: () => void;
  onComplete: () => void;
};

export default function ProgressPanel({
  accepted,
  completed,
  onAccept,
  onComplete,
}: ProgressPanelProps) {
  return (
    <section className="card progress-card">
      <p className="section-label">Progress</p>
      <label className="progress-row">
        <input type="checkbox" checked={accepted} onChange={onAccept} />
        <span>Challenge accepted</span>
      </label>
      <label className="progress-row">
        <input type="checkbox" checked={completed} onChange={onComplete} />
        <span>Challenge completed</span>
      </label>
    </section>
  );
}
