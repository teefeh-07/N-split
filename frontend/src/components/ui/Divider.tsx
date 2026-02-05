// Divider UI Component

interface DividerProps {
  text?: string;
  orientation?: 'horizontal' | 'vertical';
}

export function Divider({ text, orientation = 'horizontal' }: DividerProps) {
  if (orientation === 'vertical') {
    return <div className="w-px bg-gray-200 self-stretch" />;
  }

  if (text) {
    return (
      <div className="flex items-center gap-4 my-4">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-sm text-gray-500">{text}</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>
    );
  }

  return <div className="h-px bg-gray-200 my-4" />;
}
