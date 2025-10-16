import { FeatureCard } from "./FeatureCard";

export function Onboarding() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 relative">
            <div className="absolute inset-0 bg-[url('/confetti-bg.png')] bg-cover bg-center opacity-90"></div>
            <div className="w-full px-4 space-y-8 relative z-10">
                <div className="text-center space-y-4">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Welcome to your Printrove Dashboard
                    </h1>
                </div>

                <div className="flex flex-wrap gap-8 justify-center" style={{ height: '50vh' }}>
                    <FeatureCard
                        heading="Create Your Free Account"
                        description="Started with ease by creating your free account. In a few clicks, access our features"
                        imagePath="/high-five.png"
                    />
                    <FeatureCard
                        heading="Create your Products"
                        description="Upload your products quickly and easily. Start building your store in just a few steps"
                        imagePath="/metrics.png"
                    />
                    <FeatureCard
                        heading="Set Up Billing"
                        description="Set up billing securely to manage payments. Set up billing securely to manage"
                        imagePath="/thumbsup.png"
                    />
                    <FeatureCard
                        heading="Place your first order"
                        description="Make your brand stand out with unique branding. Stand out with unique branding"
                        imagePath="/order.png"
                    />
                </div>

                <div className="text-center space-y-4 pt-30">
                    <h3>Don't want to see the guide? <a href="/dashboard" className="text-blue-600"> Skip </a></h3>
                </div>
            </div>
        </div>
    );
}