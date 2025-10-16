import { Link } from 'react-router-dom';
import { ListBulletedIcon, PageAddIcon, ImagesIcon, WalletIcon, PaintBrushFlatIcon, LightbulbIcon, SettingsIcon, StoreIcon, OrderIcon, HomeIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from '@shopify/polaris-icons';
import React, { useState } from 'react';

export interface SideMenuProps {
    activeTab: 'dashboard' | 'catalog' | 'templates' | 'orders' | 'inventory' | 'store-connect' | 'mockup' | 'credits' | 'branding' | 'resources' | 'settings';
    isCollapsed?: boolean;
    onToggleCollapse?: () => void;
}

const SidebarItem = ({ icon, label, isActive, to, hasSubMenu, isExpanded, onToggle, activeTab, isCollapsed, onBeforeNavigate }: { 
    icon: React.ReactNode, 
    label: string, 
    isActive: boolean, 
    to: string,
    hasSubMenu?: boolean,
    isExpanded?: boolean,
    onToggle?: () => void,
    activeTab: string,
    isCollapsed?: boolean,
    onBeforeNavigate?: () => void
}) => {
    const handleClick = (e: React.MouseEvent) => {
        if (hasSubMenu) {
            e.preventDefault();
            onToggle?.();
        } else if (onBeforeNavigate) {
            // Call the callback before navigation happens
            onBeforeNavigate();
        }
    };

    const content = (
        <div 
            className={`flex items-center justify-between px-2 py-2 rounded-lg transition-colors cursor-pointer ${
                isActive ? 'bg-[#272727] text-white [&_svg]:text-white [&_svg]:fill-white' : 'text-[#202020] hover:bg-[#F4F4F5]'
            }`}
            title={isCollapsed ? label : undefined}
        >
            <div className="flex items-center gap-2">
                {icon}
                {!isCollapsed && <span className="text-sm font-medium">{label}</span>}
            </div>
            {hasSubMenu && !isCollapsed && (
                <ChevronDownIcon className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            )}
        </div>
    );

    return (
        <div>
            {hasSubMenu ? (
                <div onClick={handleClick}>{content}</div>
            ) : (
                <Link to={to} onClick={handleClick}>{content}</Link>
            )}
            {hasSubMenu && !isCollapsed && (
                <div className={`ml-6 space-y-1 overflow-hidden transition-all duration-300 ease-in-out ${
                    isExpanded ? 'max-h-[200px] opacity-100 mt-1' : 'max-h-0 opacity-0'
                }`}>
                    <Link to="/orders" className="block">
                        <div className={`px-2 py-2 rounded-lg text-sm ${
                            isActive && activeTab === 'orders' ? 'bg-[#272727] text-white' : 'text-[#202020] hover:bg-[#F4F4F5]'
                        }`}>
                            Orders
                        </div>
                    </Link>
                    <Link to="/inventory" className="block">
                        <div className={`px-2 py-2 rounded-lg text-sm ${
                            isActive && activeTab === 'inventory' ? 'bg-[#272727] text-white' : 'text-[#202020] hover:bg-[#F4F4F5]'
                        }`}>
                            Inventory
                        </div>
                    </Link>
                </div>
            )}
        </div>
    );
};

export function SideMenu({ activeTab, isCollapsed: externalCollapsed, onToggleCollapse: externalToggle }: SideMenuProps) {
    const [expandedItems, setExpandedItems] = useState<string[]>([]);
    
    // Initialize from localStorage or default to false (expanded)
    const [internalCollapsed, setInternalCollapsed] = useState(() => {
        const saved = localStorage.getItem('sidebarCollapsed');
        return saved === 'true';
    });
    
    // Use external collapse state if provided, otherwise use internal state
    const isCollapsed = externalCollapsed !== undefined ? externalCollapsed : internalCollapsed;
    
    const toggleCollapse = externalToggle || (() => {
        const newState = !internalCollapsed;
        setInternalCollapsed(newState);
        localStorage.setItem('sidebarCollapsed', String(newState));
    });

    const toggleItem = (item: string) => {
        setExpandedItems(prev => 
            prev.includes(item) 
                ? prev.filter(i => i !== item)
                : [...prev, item]
        );
    };

    const handleCatalogClick = () => {
        // Auto-collapse when clicking Product Catalog
        if (!isCollapsed) {
            const newState = true;
            setInternalCollapsed(newState);
            localStorage.setItem('sidebarCollapsed', String(newState));
        }
    };

    return (
        <div className={`bg-[#EBEBEB] p-3 flex flex-col gap-4 transition-all duration-300 ease-in-out ${
            isCollapsed ? 'w-[70px]' : 'w-[265px]'
        }`}>
            {/* Collapse/Expand Button */}
            <div className="flex justify-end">
                <button
                    onClick={toggleCollapse}
                    className="p-1.5 hover:bg-[#D8D8D8] rounded-lg transition-colors"
                    title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    {isCollapsed ? (
                        <ChevronRightIcon className='w-5 h-5 text-[#202020]' />
                    ) : (
                        <ChevronLeftIcon className='w-5 h-5 text-[#202020]' />
                    )}
                </button>
            </div>

            <nav className="flex flex-col gap-2">
                <SidebarItem
                    to="/dashboard"
                    icon={<HomeIcon className='w-5 h-5' />}
                    isActive={activeTab === 'dashboard'}
                    label="Dashboard"
                    activeTab={activeTab}
                    isCollapsed={isCollapsed}
                />
                <SidebarItem
                    to="/add-product"
                    icon={<ListBulletedIcon className='w-5 h-5' />}
                    isActive={activeTab === 'catalog'}
                    label="Product Catalog"
                    activeTab={activeTab}
                    isCollapsed={isCollapsed}
                    onBeforeNavigate={handleCatalogClick}
                />
                <SidebarItem
                    to="/templates"
                    icon={<PageAddIcon className='w-5 h-5' />}
                    isActive={activeTab === 'templates'}
                    label="Product Templates"
                    activeTab={activeTab}
                    isCollapsed={isCollapsed}
                />
                <SidebarItem
                    to="/orders"
                    icon={<OrderIcon className='w-5 h-5' />}
                    isActive={activeTab === 'orders' || activeTab === 'inventory'}
                    label="Orders"
                    hasSubMenu={true}
                    isExpanded={expandedItems.includes('orders')}
                    onToggle={() => toggleItem('orders')}
                    activeTab={activeTab}
                    isCollapsed={isCollapsed}
                />
                <SidebarItem
                    to="/store-connect"
                    icon={<StoreIcon className='w-5 h-5' />}
                    isActive={activeTab === 'store-connect'}
                    label="Store Connect"
                    activeTab={activeTab}
                    isCollapsed={isCollapsed}
                />
                <SidebarItem
                    to="/mockup"
                    icon={<ImagesIcon className='w-5 h-5' />}
                    isActive={activeTab === 'mockup'}
                    label="Mockup Generator"
                    activeTab={activeTab}
                    isCollapsed={isCollapsed}
                />
                <SidebarItem
                    to="/credits"
                    icon={<WalletIcon className='w-5 h-5' />}
                    isActive={activeTab === 'credits'}
                    label="Store Credits"
                    activeTab={activeTab}
                    isCollapsed={isCollapsed}
                />
                <SidebarItem
                    to="/branding"
                    icon={<PaintBrushFlatIcon className='w-5 h-5' />}
                    isActive={activeTab === 'branding'}
                    label="Custom Branding"
                    activeTab={activeTab}
                    isCollapsed={isCollapsed}
                />
                <SidebarItem
                    to="/resources"
                    icon={<LightbulbIcon className='w-5 h-5' />}
                    isActive={activeTab === 'resources'}
                    label="Resources"
                    activeTab={activeTab}
                    isCollapsed={isCollapsed}
                />
                <SidebarItem
                    to="/settings"
                    icon={<SettingsIcon className='w-5 h-5' />}
                    isActive={activeTab === 'settings'}
                    label="Settings"
                    activeTab={activeTab}
                    isCollapsed={isCollapsed}
                />
            </nav>
        </div>
    );
}
