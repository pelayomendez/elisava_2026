type ChallengeCardProps = {
  challenge: string;
  motivationMessage: string;
};

export default function ChallengeCard({
  challenge,
  motivationMessage,
}: ChallengeCardProps) {
  return (
    <section className="card challenge-card">
      <p className="section-label">Today's Challenge</p>
      <h2>{challenge}</h2>
      <p>{motivationMessage}</p>
    </section>
  );
}
