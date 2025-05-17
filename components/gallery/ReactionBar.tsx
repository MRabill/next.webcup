const emojiMap = {
  like: "❤️",
  sad: "😢",
  angry: "😡",
  funny: "😂",
}

interface ReactionBarProps {
  onReact?: (type: keyof typeof emojiMap) => void
  reactions?: Record<keyof typeof emojiMap, number>
}

export default function ReactionBar({ onReact, reactions }: ReactionBarProps) {
  return (
    <div className="flex gap-2">
      {Object.entries(emojiMap).map(([key, emoji]) => (
        <button
          key={key}
          onClick={() => onReact?.(key as keyof typeof emojiMap)}
          className="hover:scale-110 transition-transform text-lg"
        >
          <span>{emoji}</span>
          {reactions && (
            <span className="ml-1 text-xs">
              {reactions[key as keyof typeof emojiMap]}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
