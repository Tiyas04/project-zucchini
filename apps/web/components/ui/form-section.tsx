interface FormSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export default function FormSection({ title, children, className = "" }: FormSectionProps) {
  return (
    <div className={className}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      {children}
    </div>
  );
}
