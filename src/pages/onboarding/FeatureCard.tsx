interface FeatureCardProps {
    heading: string;
    description: string;
    imagePath?: string;
}

export function FeatureCard({ heading, description, imagePath }: FeatureCardProps) {
    return (
        <div className="w-72 h-full border-1 bg-neutral-200 border-neutral-300 rounded-lg p-4 py-25 shadow-sm flex flex-col items-center justify-center space-y-6">
            {imagePath && (
                <img src={imagePath} alt={heading} className="w-32 h-32 object-contain" />
            )}
            <h2 className="text-xl p-0 font-semibold text-gray-800">{heading}</h2>
            <p className="text-gray-600 p-0 px-5 mt-0">{description}</p>
            <div className="flex flex-col items-center gap-3 w-[75%]">
                <button 
                    className="w-full bg-gray-800 text-white py-2 px-4 rounded-lg border-neutral-200 hover:border-neutral-400 border-2 transition-colors"
                >
                    Start
                </button>
                <button 
                    className="w-full py-2 px-4 rounded border-neutral-200 hover:border-neutral-300 border-1"
                >
                    Learn More
                </button>
            </div>
        </div>
    );
};