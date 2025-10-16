interface ProgressBarProps<T extends readonly string[]> {
    currentStatus: T[number];
    statusSteps: T;
}

export function ProgressBar<T extends readonly string[]>({ currentStatus, statusSteps }: ProgressBarProps<T>) {
    const currentStepIndex = statusSteps.indexOf(currentStatus);

    return (
        <div className="flex w-fit bg-[#E3E3E3] rounded-full">
            {statusSteps.map((status, index) => (
                <div
                    key={status}
                    className={`h-12 relative flex items-center ${
                        index <= currentStepIndex ? 'bg-[#29845A]' : 'bg-[#E3E3E3]'
                    } ${index === 0 ? 'rounded-l-full' : ''} ${
                        index === statusSteps.length - 1 ? 'rounded-r-full' : ''
                    } ${index === currentStepIndex ? 'rounded-r-full' : ''}`}
                >
                    {/* Ring section */}
                    <div className="w-12 h-12 flex items-center justify-center">
                        <div className={`w-8 h-8 rounded-full border-[7px] border-white ${
                            index <= currentStepIndex ? 'bg-[#29845A]' : 'bg-white'
                        }`} />
                    </div>

                    {/* Text section */}
                    <div className="pr-5">
                        <span className={`text-base font-medium ${
                            index <= currentStepIndex ? 'text-white' : 'text-[#444444]'
                        }`}>
                            {status}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
} 