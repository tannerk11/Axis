import './SkeletonLoader.css';

/**
 * Reusable skeleton loading component with shimmer animation.
 * Variants: table, modal, card
 */
function SkeletonLoader({ variant = 'table', rows = 8 }) {
  if (variant === 'table') {
    return (
      <div className="skeleton-table">
        <div className="skeleton-table-header">
          <div className="skeleton-bar skeleton-bar--short" />
          <div className="skeleton-bar skeleton-bar--medium" />
          <div className="skeleton-bar skeleton-bar--short" />
          <div className="skeleton-bar skeleton-bar--short" />
          <div className="skeleton-bar skeleton-bar--short" />
        </div>
        {Array.from({ length: rows }, (_, i) => (
          <div className="skeleton-table-row" key={i}>
            <div className="skeleton-bar skeleton-bar--short" />
            <div className="skeleton-bar skeleton-bar--medium" />
            <div className="skeleton-bar skeleton-bar--short" />
            <div className="skeleton-bar skeleton-bar--short" />
            <div className="skeleton-bar skeleton-bar--short" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'modal') {
    return (
      <div className="skeleton-modal">
        <div className="skeleton-modal-header">
          <div className="skeleton-circle" />
          <div className="skeleton-bar skeleton-bar--wide" />
        </div>
        <div className="skeleton-modal-body">
          <div className="skeleton-bar skeleton-bar--full" />
          <div className="skeleton-bar skeleton-bar--full" />
          <div className="skeleton-bar skeleton-bar--medium" />
          <div className="skeleton-divider" />
          <div className="skeleton-bar skeleton-bar--full" />
          <div className="skeleton-bar skeleton-bar--full" />
          <div className="skeleton-bar skeleton-bar--short" />
        </div>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className="skeleton-card">
        <div className="skeleton-card-header">
          <div className="skeleton-bar skeleton-bar--wide" />
        </div>
        <div className="skeleton-card-body">
          {Array.from({ length: rows }, (_, i) => (
            <div className="skeleton-card-row" key={i}>
              <div className="skeleton-bar skeleton-bar--medium" />
              <div className="skeleton-bar skeleton-bar--short" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}

export default SkeletonLoader;
