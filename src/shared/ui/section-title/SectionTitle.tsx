import './SectionTitle.css';

type SectionTitleProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export const SectionTitle = ({
  eyebrow,
  title,
  description,
}: SectionTitleProps) => {
  return (
    <div className="section-title">
      {eyebrow ? <span className="section-title__eyebrow">{eyebrow}</span> : null}
      <h2 className="section-title__heading">{title}</h2>
      {description ? (
        <p className="section-title__description">{description}</p>
      ) : null}
    </div>
  );
};