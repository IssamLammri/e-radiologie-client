export function ContentState({
  loading,
  error,
  empty,
  children,
}: {
  loading?: boolean;
  error?: string;
  empty?: boolean;
  children: React.ReactNode;
}) {
  if (loading)
    return (
      <div className="v1-state" role="status">
        Chargement du contenu…
      </div>
    );
  if (error)
    return (
      <div className="v1-state v1-error" role="alert">
        {error}
      </div>
    );
  if (empty)
    return (
      <div className="v1-state">
        Aucun contenu disponible pour cette sélection.
      </div>
    );
  return <>{children}</>;
}
