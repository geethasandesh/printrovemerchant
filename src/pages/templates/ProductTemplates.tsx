import { useState, useEffect } from 'react';
import { Navbar } from "../../layout/Navbar";
import { SideMenu } from "../../layout/SideMenu";
import { Button } from "../../components/common/Button";
import { MenuHorizontalIcon,SearchIcon } from '@shopify/polaris-icons';
import { Layout, Text, Select } from '@shopify/polaris';
import { ProductRecommendation } from '../../components/ProductRecommendation';
import { useNavigate } from 'react-router-dom';
import { collections } from './collections';
import { useFetch } from '../../hooks/useFetch';

export function ProductTemplates() {
    const navigate = useNavigate();
    const [activePopover, setActivePopover] = useState<number | null>(null);
    const [sortValue, setSortValue] = useState('newest');
    const [searchValue, setSearchValue] = useState('');

    // Fetch saved templates from API
    const { data: templatesData, isLoading: isLoadingTemplates, refetch } = useFetch('/product-templates', 0);
    const [templates, setTemplates] = useState<any[]>([]);

    // Load templates when data is fetched
    useEffect(() => {
        if (templatesData?.data) {
            setTemplates(templatesData.data);
        }
    }, [templatesData]);

    const handleEdit = (templateId: string) => {
        navigate(`/product-catalog/design/${templateId}`);
    };

    const handleDelete = async (templateId: string) => {
        if (!confirm('Are you sure you want to delete this template?')) {
            return;
        }

        try {
            const API_URL = import.meta.env.VITE_APP_API_URL;
            const response = await fetch(`${API_URL}/product-templates/${templateId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                // Refresh templates list
                refetch();
                alert('Template deleted successfully');
            } else {
                alert('Failed to delete template');
            }
        } catch (error) {
            console.error('Error deleting template:', error);
            alert('Failed to delete template');
        }
    };

    const handleTemplateClick = (template: any) => {
        // Navigate to design editor with template data
        navigate(`/product-catalog/design/${template.baseProductId}?templateId=${template._id}`);
    };

    const handleCollectionClick = (collectionId: string) => {
        navigate(`/templates/collection/${collectionId}`);
    };

    // Filter and sort templates
    const filteredTemplates = templates
        .filter(template => 
            template.templateName.toLowerCase().includes(searchValue.toLowerCase())
        )
        .sort((a, b) => {
            if (sortValue === 'newest') {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            } else {
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            }
        });

    return (
        <div className="dashboard-page h-screen flex flex-col">
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
                <SideMenu activeTab="templates" />
                <div className="flex-1 overflow-auto">
                    <div className="bg-[#FFFFFF] min-h-full p-8">
                        <div className="flex flex-col gap-8 max-w-[70vw]">
                            <div className="flex justify-between items-center">
                                <h1 className="text-2xl font-bold text-[#000000]">
                                    Product Templates
                                </h1>
                                <div className="flex items-center gap-4">
                                    <Button 
                                        variant="secondary"
                                        size="lg"
                                        className="flex items-center gap-2 bg-[#F0F0F0] text-[#121212] hover:bg-[#e5e5e5] border border-[#E1E1E1]"
                                    >
                                        <img src="/assets/FolderSimplePlus.svg" alt="Create Collection" className="w-5 h-5" />
                                        Create Collection
                                    </Button>
                                    <Button 
                                        variant="primary"
                                        size="lg"
                                        className="flex items-center gap-2"
                                    >
                                        <img src="/assets/FilePlus.svg" alt="Create Template" className="w-5 h-5" />
                                        Create Product Template
                                    </Button>
                                </div>
                            </div>
                            <div className="flex flex-col gap-3">
                                <div className="flex justify-between items-center bg-[#C6E44F] p-8 rounded-lg">
                                    <div className="flex flex-col gap-3">
                                        <h2 className="text-3xl font-extrabold text-black">
                                            Organise your product <br />
                                            templates into collections
                                        </h2>
                                        <p className="text-black text-base">
                                            You'll see your collections here
                                        </p>
                                    </div>
                                    <img 
                                        src="/high-five.png" 
                                        alt="High Five" 
                                        className="h-[200px] object-contain"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-5">
                                <h1 className="text-2xl font-bold text-[#121212]">
                                    Collections
                                </h1>
                                <Layout>
                                    <Layout.Section>
                                        <div className="flex gap-5 flex-wrap">
                                        {collections.map((collection) => (
                                            <div
                                            key={collection.id}
                                            className="w-[218px] h-[145px] border border-[#A3A3A3] bg-[#F5F5F5] rounded-md px-4 py-[6px] cursor-pointer flex flex-col justify-center items-center relative"
                                            onClick={() => handleCollectionClick(collection.id)}
                                            >
                                            {/* Popover (ellipsis button) */}
                                            <div
                                                className="absolute top-[6px] right-[16px]"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <div className="relative">
                                                <button
                                                    className="p-2 hover:bg-gray-100 rounded-full"
                                                    onClick={() =>
                                                    setActivePopover(
                                                        activePopover === parseInt(collection.id) ? null : parseInt(collection.id)
                                                    )
                                                    }
                                                >
                                                    <MenuHorizontalIcon className="w-5 h-5" />
                                                </button>
                                                {activePopover === parseInt(collection.id) && (
                                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10">
                                                    <div className="py-1">
                                                        <button
                                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                        onClick={handleEdit}
                                                        >
                                                        Edit
                                                        </button>
                                                        <button
                                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                        onClick={handleDelete}
                                                        >
                                                        Delete
                                                        </button>
                                                    </div>
                                                    </div>
                                                )}
                                                </div>
                                            </div>
                                            <img src="/assets/Vector.svg" alt="Collection Icon" className="w-10 h-10 mb-2" />
                                            <div className="text-center">
                                                <Text as="p" variant="bodyMd" fontWeight="medium">
                                                    {collection.name}
                                                </Text>
                                            </div>
                                            </div>
                                        ))}
                                    </div>
                                    </Layout.Section>
                                </Layout>
                            </div>
                            <div className="flex flex-col gap-5">
                                <h1 className="text-2xl font-bold text-[#121212]">
                                    My Templates
                                </h1>
                                <div className="flex justify-between items-center">
                                    <div className="w-48">
                                        <Select
                                            label=""
                                            options={[
                                                {label: 'New to Old', value: 'newest'},
                                                {label: 'Old to New', value: 'oldest'},
                                            ]}
                                            value={sortValue}
                                            onChange={setSortValue}
                                        />
                                    </div>
                                    <div className="w-[360px]">
                                        <div className="flex items-center h-[32px] px-3 bg-[#F3F3F3] border border-[#E1E1E1] rounded-md">
                                            <SearchIcon className="w-4 h-4 text-gray-500" />
                                            <input
                                            type="text"
                                            value={searchValue}
                                            onChange={(e) => setSearchValue(e.target.value)}
                                            placeholder="Search your order here"
                                            className="ml-2 flex-1 bg-transparent outline-none text-sm text-[#121212] placeholder-gray-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-6">
                                    {isLoadingTemplates ? (
                                        <div className="col-span-3 text-center py-12">
                                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                                            <p className="text-gray-600">Loading templates...</p>
                                        </div>
                                    ) : filteredTemplates.length === 0 ? (
                                        <div className="col-span-3 text-center py-12">
                                            <div className="text-gray-400 mb-4">
                                                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-700 mb-2">No templates yet</h3>
                                            <p className="text-gray-500 mb-4">
                                                {searchValue ? 'No templates match your search.' : 'Create your first product template to get started!'}
                                            </p>
                                            {!searchValue && (
                                                <Button
                                                    variant="primary"
                                                    onClick={() => navigate('/catalog')}
                                                    className="mx-auto"
                                                >
                                                    Browse Products
                                                </Button>
                                            )}
                                        </div>
                                    ) : (
                                        filteredTemplates.map((template) => (
                                            <div
                                                key={template._id}
                                                className="relative bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
                                                onClick={() => handleTemplateClick(template)}
                                            >
                                                {/* Preview Image */}
                                                <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
                                                    {template.previewImage?.url ? (
                                                        <img
                                                            src={template.previewImage.url}
                                                            alt={template.templateName}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="text-center p-6">
                                                            <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                            <p className="text-xs text-gray-500 mt-2">No preview</p>
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                {/* Template Info */}
                                                <div className="p-4">
                                                    <h3 className="font-semibold text-gray-900 mb-1 truncate">{template.templateName}</h3>
                                                    {template.templateDescription && (
                                                        <p className="text-xs text-gray-600 mb-2 line-clamp-2">{template.templateDescription}</p>
                                                    )}
                                                    <div className="text-xs text-gray-500 space-y-1">
                                                        <p className="truncate">Product: {template.baseProductTitle || 'N/A'}</p>
                                                        <p>Print: {template.printType || 'N/A'} - {template.printPosition || 'N/A'}</p>
                                                        <p>{template.designLayers?.length || 0} layer(s)</p>
                                                    </div>
                                                    
                                                    {/* Tags */}
                                                    {template.tags && template.tags.length > 0 && (
                                                        <div className="flex flex-wrap gap-1 mt-2">
                                                            {template.tags.slice(0, 3).map((tag: string, idx: number) => (
                                                                <span key={idx} className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                                                                    {tag}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                {/* Actions Menu */}
                                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setActivePopover(activePopover === template._id ? null : template._id);
                                                        }}
                                                    >
                                                        <MenuHorizontalIcon className="w-4 h-4" />
                                                    </button>
                                                    {activePopover === template._id && (
                                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 border border-gray-200">
                                                            <div className="py-1">
                                                                <button
                                                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleEdit(template._id);
                                                                    }}
                                                                >
                                                                    Edit Template
                                                                </button>
                                                                <button
                                                                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleDelete(template._id);
                                                                        setActivePopover(null);
                                                                    }}
                                                                >
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
