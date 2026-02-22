'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { BarChart3, Plus, ShoppingBag, X, Menu, Image, ShoppingCart } from 'lucide-react';

import dynamic from 'next/dynamic';

const RichTextEditor = dynamic(() => import('@/components/RichTextEditor'), { ssr: false });

export const dynamicPage = 'force-dynamic';

function generateSlug(name: string) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

// SEO Preview Component
function GoogleSearchPreview({ title, description, slug }: { title: string, description: string, slug: string }) {
    const domain = typeof window !== 'undefined' ? window.location.hostname : 'example.com';
    return (
        <div className="bg-white border rounded-lg p-4 shadow-sm w-full font-sans text-sm">
            <div className="text-sm mb-1 truncate text-[#1a5e20] flex items-center gap-2">
                <span className="bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold text-gray-500 mr-1">D</span>
                <span className="truncate">{domain} &gt; product &gt; {slug || 'your-product-slug'}</span>
            </div>
            <div className="text-[#1a0dab] text-xl truncate hover:underline cursor-pointer">
                {title || 'Your Product Title Will Appear Here'}
            </div>
            <div className="text-[#4d5156] line-clamp-2 mt-1">
                {description || 'Your products meta description will appear here. Write a compelling summary to increase your click-through rate.'}
            </div>
        </div>
    );
}

// Orders Section Component
function OrdersSection() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
    const [editStatus, setEditStatus] = useState('');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    React.useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/orders');
            if (response.ok) {
                const data = await response.json();
                setOrders(data);
            }
        } catch (err) {
            console.error('Error fetching orders:', err);
            setError('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Confirmed':
                return 'bg-red-100 text-red-800 border border-red-300';
            case 'Shipped':
                return 'bg-yellow-100 text-yellow-800 border border-yellow-300';
            case 'Delivered':
                return 'bg-green-100 text-green-800 border border-green-300';
            default:
                return 'bg-gray-100 text-gray-800 border border-gray-300';
        }
    };

    const handleUpdateStatus = async (orderId: string, newStatus: string) => {
        try {
            setSaving(true);
            setError('');

            const response = await fetch(`/api/orders/${orderId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ order_status: newStatus })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update order');
            }

            setSuccess('Order status updated!');
            setSelectedOrder(null);
            await fetchOrders();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="text-center py-8">Loading orders...</div>;
    }

    if (selectedOrder) {
        const items = Array.isArray(selectedOrder.items) ? selectedOrder.items : JSON.parse(selectedOrder.items || '[]');

        return (
            <div>
                <button
                    onClick={() => { setSelectedOrder(null); setError(''); setSuccess(''); }}
                    className="mb-4 px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
                >
                    ← Back to Orders
                </button>

                <h1 className="text-3xl font-bold text-gray-900 mb-6">Order Details</h1>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
                        {success}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Items - Left Side */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Items Ordered</h2>
                            <div className="space-y-4">
                                {items.map((item: any, idx: number) => (
                                    <div key={idx} className="flex gap-4 border-b pb-4 last:border-0">
                                        {/* Product Image */}
                                        {item.images && item.images.length > 0 && (
                                            <img
                                                src={typeof item.images[0] === 'string' ? item.images[0] : item.images[0]?.url}
                                                alt={item.product_name}
                                                className="w-20 h-20 object-cover rounded"
                                            />
                                        )}
                                        {/* Product Info */}
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900">{item.product_name}</h3>
                                            <p className="text-gray-600 text-sm">Quantity: {item.quantity}</p>
                                            <p className="text-gray-600 text-sm">Price: ₹{item.price_per_unit}</p>
                                            <p className="font-bold text-[#000000]">₹{item.quantity * item.price_per_unit}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Order Info & Status - Right Side */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
                            {/* Status Badge */}
                            <div>
                                <p className="text-xs text-gray-500 uppercase mb-2">Order Status</p>
                                <div className={`inline-block px-4 py-2 rounded font-bold text-center w-full ${getStatusColor(selectedOrder.order_status)}`}>
                                    {selectedOrder.order_status}
                                </div>
                            </div>

                            {/* Customer Info */}
                            <div className="border-t pt-4">
                                <h3 className="font-bold text-gray-900 mb-2">Customer</h3>
                                <p className="text-sm text-gray-600"><strong>Name:</strong> {selectedOrder.customer_name}</p>
                                <p className="text-sm text-gray-600"><strong>Email:</strong> {selectedOrder.customer_email}</p>
                                <p className="text-sm text-gray-600"><strong>Phone:</strong> {selectedOrder.customer_phone}</p>
                            </div>

                            {/* Address */}
                            <div className="border-t pt-4">
                                <h3 className="font-bold text-gray-900 mb-2">Shipping Address</h3>
                                <p className="text-sm text-gray-600">{selectedOrder.shipping_address}</p>
                            </div>

                            {/* Total */}
                            <div className="border-t pt-4 bg-gray-50 p-3 rounded">
                                <p className="text-sm text-gray-600">Total Amount</p>
                                <p className="text-2xl font-bold text-[#000000]">₹{selectedOrder.total_amount}</p>
                            </div>

                            {/* Status Buttons */}
                            <div className="border-t pt-4">
                                <p className="text-xs text-gray-500 uppercase mb-2">Change Status</p>
                                <div className="space-y-2">
                                    {['Confirmed', 'Shipped', 'Delivered'].map(status => (
                                        <button
                                            key={status}
                                            onClick={() => handleUpdateStatus(selectedOrder.id, status)}
                                            disabled={saving || selectedOrder.order_status === status}
                                            className={`w-full py-2 rounded font-medium text-sm transition ${selectedOrder.order_status === status
                                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                                }`}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Orders</h1>
            <p className="text-gray-600 mb-8">Manage all customer orders</p>

            {orders.length === 0 ? (
                <div className="bg-white rounded-lg p-6 shadow-sm text-center text-gray-500">
                    No orders yet
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map(order => {
                        const items = Array.isArray(order.items) ? order.items : JSON.parse(order.items || '[]');
                        return (
                            <div
                                key={order.id}
                                onClick={() => setSelectedOrder(order)}
                                className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition cursor-pointer"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                                    {/* Items Preview */}
                                    <div className="md:col-span-2">
                                        <h3 className="font-semibold text-gray-900 mb-2">Items ({items.length})</h3>
                                        <div className="flex gap-2 flex-wrap">
                                            {items.slice(0, 3).map((item: any, idx: number) => (
                                                <div key={idx} className="relative">
                                                    {item.images && item.images.length > 0 && (
                                                        <img
                                                            src={typeof item.images[0] === 'string' ? item.images[0] : item.images[0]?.url}
                                                            alt={item.product_name}
                                                            className="w-12 h-12 object-cover rounded border"
                                                            title={item.product_name}
                                                        />
                                                    )}
                                                </div>
                                            ))}
                                            {items.length > 3 && (
                                                <div className="w-12 h-12 bg-gray-200 rounded border flex items-center justify-center text-sm font-bold text-gray-600">
                                                    +{items.length - 3}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Total */}
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase mb-1">Total</p>
                                        <p className="text-xl font-bold text-[#000000]">₹{order.total_amount}</p>
                                    </div>

                                    {/* Status */}
                                    <div className="flex justify-end">
                                        <div className={`px-4 py-2 rounded font-bold text-sm ${getStatusColor(order.order_status)}`}>
                                            {order.order_status}
                                        </div>
                                    </div>
                                </div>

                                {/* Customer Info */}
                                <div className="mt-3 pt-3 border-t text-sm text-gray-600">
                                    <p><strong>{order.customer_name}</strong> • {order.customer_email}</p>
                                    <p className="text-xs text-gray-400">Ordered: {new Date(order.created_at).toLocaleString('en-IN')}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

// Update Products Section Component
function UpdateProductsSection() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
    const [editData, setEditData] = useState<any | null>(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleting, setDeleting] = useState(false);

    React.useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/products');
            if (response.ok) {
                const data = await response.json();
                setProducts(data);
            }
        } catch (err) {
            console.error('Error fetching products:', err);
            setError('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectProduct = (product: any) => {
        setSelectedProduct(product);
        setEditData({ ...product });
        setError('');
        setSuccess('');
    };

    const handleEditChange = (field: string, value: any) => {
        setEditData((prev: any) => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSaveProduct = async () => {
        try {
            setSaving(true);
            setError('');
            setSuccess('');

            // Validate
            if (!editData.name || !editData.category || !editData.description || editData.price < 0) {
                throw new Error('Please fill in all required fields with valid data');
            }

            if (editData.sale_price && editData.sale_price < 0) {
                throw new Error('Sale price cannot be negative');
            }

            if (editData.sale_price && editData.sale_price > editData.price) {
                throw new Error('Sale price cannot be higher than regular price');
            }

            const response = await fetch(`/api/products/${editData.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update product');
            }

            setSuccess('Product updated successfully!');
            setSelectedProduct(null);
            setEditData(null);
            await fetchProducts();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteProduct = async () => {
        try {
            setDeleting(true);
            setError('');

            const response = await fetch(`/api/products/${editData.id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete product');
            }

            setSuccess('Product deleted successfully!');
            setSelectedProduct(null);
            setEditData(null);
            setShowDeleteConfirm(false);
            await fetchProducts();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return <div className="text-center py-8">Loading products...</div>;
    }

    if (selectedProduct && editData) {
        return (
            <div>
                <button
                    onClick={() => { setSelectedProduct(null); setEditData(null); }}
                    className="mb-4 px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
                >
                    ← Back to Products
                </button>

                <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Product</h1>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
                        {success}
                    </div>
                )}

                <div className="bg-white rounded-lg p-8 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                            <input
                                type="text"
                                value={editData.name}
                                onChange={(e) => handleEditChange('name', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#000000]"
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                            <input
                                type="text"
                                value={editData.category}
                                onChange={(e) => handleEditChange('category', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#000000]"
                            />
                        </div>

                        {/* Price */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹)</label>
                            <input
                                type="number"
                                value={editData.price === null || editData.price === undefined ? '' : editData.price}
                                onChange={(e) => handleEditChange('price', e.target.value ? parseInt(e.target.value) : 0)}
                                min="0"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#000000]"
                            />
                        </div>

                        {/* Sale Price */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Sale Price (₹) <span className="text-gray-400 text-xs">(optional)</span></label>
                            <input
                                type="number"
                                value={editData.sale_price === null || editData.sale_price === undefined ? '' : editData.sale_price}
                                onChange={(e) => handleEditChange('sale_price', e.target.value ? parseInt(e.target.value) : null)}
                                min="0"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#000000]"
                            />
                        </div>

                        {/* Sizes */}
                        <div className="md:col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Sizes (comma-separated)</label>
                            <input
                                type="text"
                                value={Array.isArray(editData.sizes) ? editData.sizes.join(', ') : editData.sizes}
                                onChange={(e) => handleEditChange('sizes', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#000000]"
                            />
                        </div>

                        {/* New Arrival */}
                        <div className="flex items-end">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={editData.new_arrival || false}
                                    onChange={(e) => handleEditChange('new_arrival', e.target.checked)}
                                    className="w-4 h-4 rounded"
                                />
                                <span className="text-sm font-medium text-gray-700">Mark as New Arrival</span>
                            </label>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <RichTextEditor
                            value={editData.description || ''}
                            onChange={(val) => handleEditChange('description', val)}
                        />
                    </div>

                    {/* SEO Settings */}
                    <div className="mt-8 border-t border-gray-200 pt-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">SEO Settings</h3>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                {/* Meta Title */}
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <label className="block text-sm font-medium text-gray-700">Meta Title</label>
                                        <span className={`text-xs ${(editData.meta_title?.length || 0) > 60 ? 'text-red-500' : 'text-gray-500'}`}>
                                            {editData.meta_title?.length || 0}/60
                                        </span>
                                    </div>
                                    <input
                                        type="text"
                                        value={editData.meta_title || ''}
                                        onChange={(e) => handleEditChange('meta_title', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#000000]"
                                    />
                                </div>

                                {/* Meta Description */}
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <label className="block text-sm font-medium text-gray-700">Meta Description</label>
                                        <span className={`text-xs ${(editData.meta_description?.length || 0) < 150 || (editData.meta_description?.length || 0) > 160 ? 'text-orange-500' : 'text-green-600'}`}>
                                            {editData.meta_description?.length || 0} chars (recommend 150-160)
                                        </span>
                                    </div>
                                    <textarea
                                        value={editData.meta_description || ''}
                                        onChange={(e) => handleEditChange('meta_description', e.target.value)}
                                        rows={3}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#000000]"
                                    ></textarea>
                                </div>

                                {/* Slug */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">URL Slug</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={editData.slug || ''}
                                            onChange={(e) => {
                                                const val = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
                                                handleEditChange('slug', val);
                                            }}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#000000]"
                                        />
                                        <button
                                            onClick={() => handleEditChange('slug', generateSlug(editData.name || ''))}
                                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg text-sm font-medium whitespace-nowrap hover:bg-gray-300"
                                            type="button"
                                        >
                                            Auto-generate
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Live Preview */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Google Search Preview</label>
                                <GoogleSearchPreview
                                    title={editData.meta_title || editData.name}
                                    description={editData.meta_description || (editData.description?.replace(/<[^>]+>/g, '') || '').substring(0, 160)}
                                    slug={editData.slug || generateSlug(editData.name || '')}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Images Preview */}
                    {editData.images && editData.images.length > 0 && (
                        <div className="mt-8 border-t border-gray-200 pt-6">
                            <div className="flex justify-between items-center mb-4">
                                <label className="block text-sm font-medium text-gray-700">Current Images & Alt Text</label>
                                <span className="text-xs text-gray-500">
                                    {(editData.images || []).filter((img: any) => typeof img === 'object' ? !!img.alt : false).length}/{editData.images?.length || 0} images have alt text
                                </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {(Array.isArray(editData.images) ? editData.images : []).map((img: any, idx: number) => {
                                    const url = typeof img === 'string' ? img : img.url;
                                    const alt = typeof img === 'string' ? '' : (img.alt || '');
                                    return (
                                        <div key={idx} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                                            <img
                                                src={url}
                                                alt={`Product ${idx}`}
                                                className="w-full h-40 object-cover rounded border border-gray-200 mb-3"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Alt text (describe image)"
                                                value={alt}
                                                onChange={(e) => {
                                                    const newImages = [...editData.images];
                                                    // Make sure we convert string to object if necessary
                                                    const currentUrl = typeof newImages[idx] === 'string' ? newImages[idx] : newImages[idx].url;
                                                    newImages[idx] = { url: currentUrl, alt: e.target.value };
                                                    handleEditChange('images', newImages);
                                                }}
                                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-[#000000]"
                                            />
                                            <p className="text-[10px] text-gray-400 mt-1 text-right">
                                                {alt.length} chars
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Save Button */}
                    <div className="mt-8 flex gap-4">
                        <button
                            onClick={handleSaveProduct}
                            disabled={saving}
                            className="px-6 py-2 bg-[#000000] text-[#ffffff] rounded-lg font-medium hover:bg-[#000000]/90 transition disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button
                            onClick={() => { setSelectedProduct(null); setEditData(null); }}
                            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition ml-auto"
                        >
                            Delete Product
                        </button>
                    </div>

                    {/* Delete Confirmation Modal */}
                    {showDeleteConfirm && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white rounded-lg p-8 max-w-md mx-4">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Delete Product?</h2>
                                <p className="text-gray-600 mb-2">
                                    Are you sure you want to delete <strong>"{editData.name}"</strong>?
                                </p>
                                <p className="text-red-600 font-medium mb-6">
                                    ⚠️ This action cannot be undone. The product will be permanently removed.
                                </p>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowDeleteConfirm(false)}
                                        className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleDeleteProduct}
                                        disabled={deleting}
                                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition disabled:opacity-50"
                                    >
                                        {deleting ? 'Deleting...' : 'Delete Permanently'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Update Products</h1>
            <p className="text-gray-600 mb-8">Select a product to edit</p>

            {products.length === 0 ? (
                <div className="bg-white rounded-lg p-6 shadow-sm text-center text-gray-500">
                    No products found
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map(product => (
                        <div
                            key={product.id}
                            onClick={() => handleSelectProduct(product)}
                            className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition cursor-pointer"
                        >
                            {/* Product Image */}
                            <div className="w-full h-40 bg-gray-200 overflow-hidden">
                                {product.images && product.images.length > 0 ? (
                                    <img
                                        src={typeof product.images[0] === 'string' ? product.images[0] : product.images[0]?.url}
                                        alt={typeof product.images[0] === 'string' ? product.name : (product.images[0]?.alt || product.name)}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        No image
                                    </div>
                                )}
                            </div>

                            {/* Product Info */}
                            <div className="p-4">
                                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{product.name}</h3>
                                <p className="text-sm text-gray-500 mb-2 capitalize">{product.category}</p>

                                <div className="flex items-center gap-2 mb-3">
                                    {product.sale_price ? (
                                        <>
                                            <span className="text-gray-400 line-through text-sm">₹{product.price}</span>
                                            <span className="font-bold text-[#000000]">₹{product.sale_price}</span>
                                        </>
                                    ) : (
                                        <span className="font-bold text-[#000000]">₹{product.price}</span>
                                    )}
                                </div>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleSelectProduct(product);
                                    }}
                                    className="w-full py-2 bg-[#000000] text-[#ffffff] rounded font-medium text-sm hover:bg-[#000000]/90 transition"
                                >
                                    Edit Product
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// Add Product Form Component
function AddProductForm() {
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        customCategory: '',
        description: '',
        price: '',
        salePrice: '',
        sizes: '',
        newArrival: false,
        images: [] as File[],
        metaTitle: '',
        metaDescription: '',
        slug: '',
        imageAlts: [] as string[]
    });
    const [categories, setCategories] = useState<string[]>([]);
    const [showCustomCategory, setShowCustomCategory] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Fetch categories from database on mount
    React.useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('/api/categories');
                if (response.ok) {
                    const data = await response.json();
                    setCategories(data.categories || []);
                }
            } catch (err) {
                console.error('Error fetching categories:', err);
            }
        };

        fetchCategories();
    }, []);

    const getISTTimestamp = () => {
        const now = new Date();
        const options: Intl.DateTimeFormatOptions = {
            timeZone: 'Asia/Kolkata',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        };

        // Get parts to construct YYYY-MM-DD HH:mm:ss format which Postgres accepts
        const parts = new Intl.DateTimeFormat('en-GB', options).formatToParts(now);
        const getPart = (name: string) => parts.find(p => p.type === name)?.value;

        return `${getPart('year')}-${getPart('month')}-${getPart('day')} ${getPart('hour')}:${getPart('minute')}:${getPart('second')}`;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            newArrival: e.target.checked
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFormData(prev => ({
                ...prev,
                images: Array.from(e.target.files as FileList),
                imageAlts: Array.from(e.target.files as FileList).map(() => '')
            }));
        }
    };

    const removeImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
            imageAlts: prev.imageAlts.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            // Validate required fields
            if (!formData.name || !formData.category || !formData.description || !formData.price) {
                throw new Error('Please fill in all required fields');
            }

            // Validate prices
            const price = parseInt(formData.price);
            if (price < 0) {
                throw new Error('Price cannot be negative');
            }

            if (formData.salePrice) {
                const salePrice = parseInt(formData.salePrice);
                if (salePrice < 0) {
                    throw new Error('Sale price cannot be negative');
                }
                if (salePrice > price) {
                    throw new Error('Sale price cannot be higher than regular price');
                }
            }

            if (formData.images.length === 0) {
                throw new Error('Please upload at least one image');
            }

            const timestamp = getISTTimestamp();
            const productId = `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

            // Upload images via API endpoint
            let imagePaths: string[] = [];

            try {
                const uploadFormData = new FormData();
                formData.images.forEach(file => {
                    uploadFormData.append('files', file);
                });
                uploadFormData.append('productId', productId);

                const uploadResponse = await fetch('/api/upload', {
                    method: 'POST',
                    body: uploadFormData
                });

                if (!uploadResponse.ok) {
                    const errorData = await uploadResponse.json();
                    throw new Error(errorData.message || 'Failed to upload images');
                }

                const uploadData = await uploadResponse.json();
                imagePaths = uploadData.urls;
            } catch (uploadError) {
                throw new Error(`Failed to upload images: ${uploadError instanceof Error ? uploadError.message : 'Unknown error'}`);
            }

            // Prepare product data
            const productData = {
                id: productId,
                name: formData.name,
                category: formData.category.toLowerCase().trim(),
                description: formData.description,
                price: parseInt(formData.price),
                sale_price: formData.salePrice ? parseInt(formData.salePrice) : null,
                images: imagePaths.map((url, idx) => ({ url, alt: formData.imageAlts[idx] || '' })),
                sizes: formData.sizes ? formData.sizes.split(',').map(s => s.trim()).filter(s => s) : [],
                new_arrival: formData.newArrival,
                meta_title: formData.metaTitle,
                meta_description: formData.metaDescription,
                slug: formData.slug || generateSlug(formData.name),
                created_at: timestamp
            };

            // Send to API
            const response = await fetch('/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(productData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to add product');
            }

            setSuccess(`Product "${formData.name}" added successfully!`);
            setFormData({
                name: '',
                category: '',
                customCategory: '',
                description: '',
                price: '',
                salePrice: '',
                sizes: '',
                newArrival: false,
                images: [],
                metaTitle: '',
                metaDescription: '',
                slug: '',
                imageAlts: []
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Product</h1>
            <p className="text-gray-600 mb-8">Create a new product listing</p>

            <form onSubmit={handleSubmit} className="bg-white rounded-lg p-8 shadow-sm">
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
                        {success}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Product Name *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#000000] focus:border-transparent"
                            placeholder="e.g., Midnight Indigo Noir"
                            required
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category *
                        </label>
                        <select
                            name="category"
                            value={showCustomCategory ? 'custom' : formData.category}
                            onChange={(e) => {
                                if (e.target.value === 'add-new') {
                                    setShowCustomCategory(true);
                                    setFormData(prev => ({ ...prev, category: '', customCategory: '' }));
                                } else {
                                    setShowCustomCategory(false);
                                    setFormData(prev => ({ ...prev, category: e.target.value }));
                                }
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#000000] focus:border-transparent"
                            required={!showCustomCategory}
                        >
                            <option value="">Select Category</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                            ))}
                            <option value="add-new">+ Add New Category</option>
                        </select>

                        {showCustomCategory && (
                            <input
                                type="text"
                                value={formData.customCategory}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    customCategory: e.target.value,
                                    category: e.target.value
                                }))}
                                placeholder="Enter new category name (e.g., Winter Coats)"
                                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#000000] focus:border-transparent"
                                required
                            />
                        )}
                    </div>

                    {/* Price */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Price (₹) *
                        </label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            min="0"
                            step="1"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#000000] focus:border-transparent"
                            placeholder="e.g., 9999"
                            required
                        />
                    </div>

                    {/* Sale Price */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Sale Price (₹) <span className="text-gray-400 text-xs">(optional)</span>
                        </label>
                        <input
                            type="number"
                            name="salePrice"
                            value={formData.salePrice}
                            onChange={handleInputChange}
                            min="0"
                            step="1"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#000000] focus:border-transparent"
                            placeholder="e.g., 7999"
                        />
                    </div>

                    {/* Sizes */}
                    <div className="md:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Sizes <span className="text-gray-400 text-xs">(comma-separated)</span>
                        </label>
                        <input
                            type="text"
                            name="sizes"
                            value={formData.sizes}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#000000] focus:border-transparent"
                            placeholder="e.g., XS, S, M, L, XL"
                        />
                    </div>

                    {/* New Arrival Checkbox */}
                    <div className="flex items-end">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                name="newArrival"
                                checked={formData.newArrival}
                                onChange={handleCheckboxChange}
                                className="w-4 h-4 rounded border-gray-300 text-[#000000] focus:ring-[#000000]"
                            />
                            <span className="text-sm font-medium text-gray-700">Mark as New Arrival</span>
                        </label>
                    </div>
                </div>

                {/* Description */}
                <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description *
                    </label>
                    <RichTextEditor
                        value={formData.description}
                        onChange={(val) => setFormData(prev => ({ ...prev, description: val }))}
                    />
                </div>

                {/* SEO Settings */}
                <div className="mt-8 border-t border-gray-200 pt-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">SEO Settings</h3>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            {/* Meta Title */}
                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="block text-sm font-medium text-gray-700">Meta Title</label>
                                    <span className={`text-xs ${(formData.metaTitle?.length || 0) > 60 ? 'text-red-500' : 'text-gray-500'}`}>
                                        {formData.metaTitle?.length || 0}/60
                                    </span>
                                </div>
                                <input
                                    type="text"
                                    name="metaTitle"
                                    value={formData.metaTitle}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#000000]"
                                />
                            </div>

                            {/* Meta Description */}
                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="block text-sm font-medium text-gray-700">Meta Description</label>
                                    <span className={`text-xs ${(formData.metaDescription?.length || 0) < 150 || (formData.metaDescription?.length || 0) > 160 ? 'text-orange-500' : 'text-green-600'}`}>
                                        {formData.metaDescription?.length || 0} chars (recommend 150-160)
                                    </span>
                                </div>
                                <textarea
                                    name="metaDescription"
                                    value={formData.metaDescription}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#000000]"
                                ></textarea>
                            </div>

                            {/* Slug */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">URL Slug</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        name="slug"
                                        value={formData.slug}
                                        onChange={(e) => {
                                            const val = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
                                            setFormData(prev => ({ ...prev, slug: val }));
                                        }}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#000000]"
                                    />
                                    <button
                                        onClick={() => setFormData(prev => ({ ...prev, slug: generateSlug(formData.name) }))}
                                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg text-sm font-medium whitespace-nowrap hover:bg-gray-300"
                                        type="button"
                                    >
                                        Auto-generate
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Live Preview */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Google Search Preview</label>
                            <GoogleSearchPreview
                                title={formData.metaTitle || formData.name}
                                description={formData.metaDescription || (formData.description?.replace(/<[^>]+>/g, '') || '').substring(0, 160)}
                                slug={formData.slug || generateSlug(formData.name)}
                            />
                        </div>
                    </div>
                </div>

                {/* Images */}
                <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product Images *
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-[#000000] transition">
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                            id="image-upload"
                        />
                        <label htmlFor="image-upload" className="cursor-pointer">
                            <p className="text-gray-600">Click to upload or drag and drop</p>
                            <p className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB</p>
                        </label>
                    </div>

                    {/* Image Preview & Alt Text */}
                    {formData.images.length > 0 && (
                        <div className="mt-6 border-t border-gray-200 pt-6">
                            <div className="flex justify-between items-center mb-4">
                                <label className="block text-sm font-medium text-gray-700">Selected Images & Alt Text</label>
                                <span className="text-xs text-gray-500">
                                    {formData.imageAlts.filter(alt => alt.length > 0).length}/{formData.images.length} images have alt text
                                </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {formData.images.map((file, index) => (
                                    <div key={index} className="relative group border border-gray-200 rounded-lg p-3 bg-gray-50">
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt={`Preview ${index + 1}`}
                                            className="w-full h-40 object-cover rounded border border-gray-200 mb-3"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Alt text (describe image)"
                                            value={formData.imageAlts[index] || ''}
                                            onChange={(e) => {
                                                const newAlts = [...formData.imageAlts];
                                                newAlts[index] = e.target.value;
                                                setFormData(prev => ({ ...prev, imageAlts: newAlts }));
                                            }}
                                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-[#000000]"
                                        />
                                        <p className="text-[10px] text-gray-400 mt-1 text-right">
                                            {(formData.imageAlts[index] || '').length} chars
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition shadow-sm z-10"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Timestamp Display */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600">
                        <strong>Created At (IST):</strong> {getISTTimestamp()}
                    </p>
                </div>

                {/* Submit Button */}
                <div className="mt-8 flex gap-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-[#000000] text-[#ffffff] rounded-lg font-medium hover:bg-[#000000]/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Adding Product...' : 'Add Product'}
                    </button>
                </div>
            </form>
        </div>
    );
}

// Hero Images Section Component
function HeroImagesSection() {
    const [heroImages, setHeroImages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');

    React.useEffect(() => {
        fetchHeroImages();
    }, []);

    const fetchHeroImages = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/hero-images');
            if (response.ok) {
                const data = await response.json();
                setHeroImages(data);
            }
        } catch (err) {
            console.error('Error fetching hero images:', err);
            setError('Failed to load hero images');
        } finally {
            setLoading(false);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
            if (!validTypes.includes(file.type)) {
                setError('Invalid file type. Only JPEG, PNG, and WebP are allowed.');
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setError('File size must be less than 5MB');
                return;
            }

            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            setError('');
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setError('Please select an image first');
            return;
        }

        try {
            setUploading(true);
            setError('');
            setSuccess('');

            // Upload image file
            const uploadFormData = new FormData();
            uploadFormData.append('file', selectedFile);

            const uploadResponse = await fetch('/api/hero-images/upload', {
                method: 'POST',
                body: uploadFormData
            });

            if (!uploadResponse.ok) {
                const errorData = await uploadResponse.json();
                throw new Error(errorData.message || 'Failed to upload image');
            }

            const uploadData = await uploadResponse.json();
            const imageUrl = uploadData.url;

            // Add to database
            const addResponse = await fetch('/api/hero-images', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image_url: imageUrl })
            });

            if (!addResponse.ok) {
                const errorData = await addResponse.json();
                throw new Error(errorData.message || 'Failed to add image to database');
            }

            setSuccess('Hero image added successfully!');
            setSelectedFile(null);
            setPreviewUrl('');
            await fetchHeroImages();

            // Clear file input
            const fileInput = document.getElementById('hero-image-input') as HTMLInputElement;
            if (fileInput) fileInput.value = '';
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this hero image?')) {
            return;
        }

        try {
            setError('');
            setSuccess('');

            const response = await fetch(`/api/hero-images?id=${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete image');
            }

            setSuccess('Hero image deleted successfully!');
            await fetchHeroImages();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        }
    };

    if (loading) {
        return <div className="text-center py-8">Loading hero images...</div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Hero Images</h1>
            <p className="text-gray-600 mb-8">Manage the slideshow images on the homepage</p>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                    {error}
                </div>
            )}

            {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
                    {success}
                </div>
            )}

            {/* Upload Section */}
            <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Add New Hero Image</h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Image
                        </label>
                        <input
                            id="hero-image-input"
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            onChange={handleFileSelect}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#000000]"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Supported formats: JPEG, PNG, WebP (Max 5MB)
                        </p>
                    </div>

                    {previewUrl && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Preview
                            </label>
                            <img
                                src={previewUrl}
                                alt="Preview"
                                className="w-full max-w-md h-48 object-cover rounded-lg border border-gray-200"
                            />
                        </div>
                    )}

                    <button
                        onClick={handleUpload}
                        disabled={!selectedFile || uploading}
                        className="px-6 py-2 bg-[#000000] text-[#ffffff] rounded-lg font-medium hover:bg-[#000000]/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {uploading ? 'Uploading...' : 'Add Hero Image'}
                    </button>
                </div>
            </div>

            {/* Current Images */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Current Hero Images</h2>

                {heroImages.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                        No hero images found. Add your first image above.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {heroImages.map((image, index) => (
                            <div
                                key={image.id}
                                className="relative bg-gray-50 rounded-lg overflow-hidden border border-gray-200 group"
                            >
                                <img
                                    src={image.image_url}
                                    alt={`Hero ${index + 1}`}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-4">
                                    <p className="text-sm text-gray-600 mb-2">
                                        Display Order: {image.display_order}
                                    </p>
                                    <button
                                        onClick={() => handleDelete(image.id)}
                                        className="w-full py-2 bg-red-600 text-white rounded font-medium text-sm hover:bg-red-700 transition"
                                    >
                                        Remove Image
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// Carts Section Component
function CartsSection() {
    const [carts, setCarts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'abandoned' | 'bought'>('all');

    React.useEffect(() => {
        fetchCarts();
    }, []);

    const fetchCarts = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/carts');
            if (res.ok) {
                const data = await res.json();
                setCarts(data);
            }
        } catch (err) {
            console.error('Error fetching carts:', err);
        } finally {
            setLoading(false);
        }
    };

    const total = carts.length;
    const abandoned = carts.filter(c => c.cart_status === 'abandoned').length;
    const bought = carts.filter(c => c.cart_status === 'bought').length;

    const filtered = filter === 'all' ? carts : carts.filter(c => c.cart_status === filter);

    const statusBadge = (status: string) => {
        if (status === 'bought') return 'bg-green-100 text-green-800 border border-green-300';
        if (status === 'abandoned') return 'bg-orange-100 text-orange-800 border border-orange-300';
        return 'bg-gray-100 text-gray-600 border border-gray-300';
    };

    if (loading) return <div className="text-center py-8">Loading carts...</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Carts</h1>
            <p className="text-gray-600 mb-8">Track customer cart activity</p>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-8">
                <button
                    onClick={() => setFilter('all')}
                    className={`rounded-xl p-4 sm:p-5 text-left transition border-2 ${filter === 'all' ? 'border-[#000000] bg-[#000000] text-white' : 'border-transparent bg-white shadow-sm hover:shadow-md'
                        }`}
                >
                    <p className={`text-xs uppercase tracking-wider mb-1 font-medium ${filter === 'all' ? 'text-[#ffffff]' : 'text-gray-500'}`}>Total Carts</p>
                    <p className={`text-3xl sm:text-4xl font-bold ${filter === 'all' ? 'text-white' : 'text-gray-900'}`}>{total}</p>
                </button>
                <button
                    onClick={() => setFilter('abandoned')}
                    className={`rounded-xl p-4 sm:p-5 text-left transition border-2 ${filter === 'abandoned' ? 'border-orange-500 bg-orange-500 text-white' : 'border-transparent bg-white shadow-sm hover:shadow-md'
                        }`}
                >
                    <p className={`text-xs uppercase tracking-wider mb-1 font-medium ${filter === 'abandoned' ? 'text-orange-100' : 'text-gray-500'}`}>Abandoned</p>
                    <p className={`text-3xl sm:text-4xl font-bold ${filter === 'abandoned' ? 'text-white' : 'text-orange-600'}`}>{abandoned}</p>
                </button>
                <button
                    onClick={() => setFilter('bought')}
                    className={`rounded-xl p-4 sm:p-5 text-left transition border-2 ${filter === 'bought' ? 'border-green-600 bg-green-600 text-white' : 'border-transparent bg-white shadow-sm hover:shadow-md'
                        }`}
                >
                    <p className={`text-xs uppercase tracking-wider mb-1 font-medium ${filter === 'bought' ? 'text-green-100' : 'text-gray-500'}`}>Converted</p>
                    <p className={`text-3xl sm:text-4xl font-bold ${filter === 'bought' ? 'text-white' : 'text-green-600'}`}>{bought}</p>
                </button>
            </div>

            {/* Cart List */}
            {filtered.length === 0 ? (
                <div className="bg-white rounded-lg p-8 text-center text-gray-500 shadow-sm">
                    No carts found
                </div>
            ) : (
                <div className="space-y-3">
                    {filtered.map(cart => {
                        const items = Array.isArray(cart.items) ? cart.items : [];
                        const cartValue = items.reduce((sum: number, item: any) => sum + ((item.salePrice || item.price) * item.quantity), 0);
                        return (
                            <div key={cart.id} className="bg-white rounded-lg p-4 shadow-sm">
                                {/* Top row: name + badge + value */}
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-2 mb-0.5">
                                            <p className="font-semibold text-gray-900 truncate text-sm sm:text-base">{cart.user_name || cart.user_email}</p>
                                            <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize flex-shrink-0 ${statusBadge(cart.cart_status)}`}>
                                                {cart.cart_status}
                                            </span>
                                        </div>
                                        <p className="text-xs sm:text-sm text-gray-500 truncate">{cart.user_email}</p>
                                    </div>
                                    {/* Value — always visible top-right */}
                                    <div className="text-right flex-shrink-0">
                                        {cartValue > 0 && (
                                            <p className="text-base sm:text-lg font-bold text-[#000000]">₹{cartValue}</p>
                                        )}
                                        {cart.cart_status === 'bought' && cart.order_total && (
                                            <p className="text-xs text-green-600 font-medium">Ordered ₹{cart.order_total}</p>
                                        )}
                                        <p className="text-xs text-gray-400 mt-0.5">
                                            {new Date(cart.updated_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </p>
                                    </div>
                                </div>
                                {/* Items row */}
                                {items.length > 0 ? (
                                    <div className="flex gap-1.5 flex-wrap mt-2">
                                        {items.slice(0, 3).map((item: any, idx: number) => (
                                            <div key={idx} className="flex items-center gap-1 bg-gray-50 border border-gray-100 rounded px-2 py-1 max-w-[160px]">
                                                {item.image && (
                                                    <img src={item.image} alt={item.name} className="w-5 h-5 object-cover rounded flex-shrink-0" />
                                                )}
                                                <span className="text-xs text-gray-700 truncate">{item.name}</span>
                                                <span className="text-xs text-gray-400 flex-shrink-0">×{item.quantity}</span>
                                            </div>
                                        ))}
                                        {items.length > 3 && (
                                            <span className="text-xs text-gray-400 self-center">+{items.length - 3} more</span>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-xs text-gray-400 italic mt-2">Empty cart</p>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default function AdminPage() {
    const { data: session, status } = useSession();
    const [activeTab, setActiveTab] = useState('update');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Show loading while checking authentication
    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#000000]">
                <div className="text-[#ffffff] text-xl">Loading...</div>
            </div>
        );
    }

    // Show 404 if not logged in or not admin
    if (!session || !session.user.admin) {
        return (
            <main className="min-h-screen flex flex-col bg-white">
                <Navbar />
                <div className="flex-grow flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
                        <p className="text-xl text-gray-600 mb-8">Page not found</p>
                        <Link
                            href="/"
                            className="inline-block bg-[#000000] text-white px-8 py-3 uppercase tracking-widest text-xs hover:bg-[#1a1a1a] transition duration-300"
                        >
                            Back to Home
                        </Link>
                    </div>
                </div>
                <Footer />
            </main>
        );
    }

    // Show admin content with layout
    return (
        <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
            {/* Header */}
            <Navbar />

            {/* Main Content */}
            <div className="flex flex-1 relative">
                {/* Left Sidebar - Hidden on Mobile */}
                <div className="hidden lg:block w-64 bg-white border-r border-gray-200 shadow-sm">
                    <div className="p-6">
                        <h2 className="text-sm font-semibold text-gray-800 mb-6 uppercase tracking-wider">Admin Panel</h2>

                        <nav className="space-y-2">
                            {/* Update */}
                            <button
                                onClick={() => setActiveTab('update')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'update'
                                    ? 'bg-[#000000] text-[#ffffff]'
                                    : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <BarChart3 size={18} />
                                <span className="text-sm font-medium">Update</span>
                            </button>

                            {/* Add New */}
                            <button
                                onClick={() => setActiveTab('add')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'add'
                                    ? 'bg-[#000000] text-[#ffffff]'
                                    : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <Plus size={18} />
                                <span className="text-sm font-medium">Add New</span>
                            </button>

                            {/* Orders */}
                            <button
                                onClick={() => setActiveTab('orders')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'orders'
                                    ? 'bg-[#000000] text-[#ffffff]'
                                    : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <ShoppingBag size={18} />
                                <span className="text-sm font-medium">Orders</span>
                            </button>

                            {/* Hero Images */}
                            <button
                                onClick={() => setActiveTab('hero')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'hero'
                                    ? 'bg-[#000000] text-[#ffffff]'
                                    : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <Image size={18} />
                                <span className="text-sm font-medium">Hero Images</span>
                            </button>

                            {/* Carts */}
                            <button
                                onClick={() => setActiveTab('carts')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'carts'
                                    ? 'bg-[#000000] text-[#ffffff]'
                                    : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <ShoppingCart size={18} />
                                <span className="text-sm font-medium">Carts</span>
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Mobile Hamburger Button */}
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="lg:hidden absolute left-4 top-4 z-50 p-2 text-black transition-transform duration-300 ease-in-out"
                    style={{
                        transform: mobileMenuOpen ? 'rotate(90deg)' : 'rotate(0deg)'
                    }}
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Mobile Sidebar - Slide Out Menu */}
                {mobileMenuOpen && (
                    <div
                        className="lg:hidden fixed inset-0 z-40 bg-black/50 transition-opacity duration-300"
                        onClick={() => setMobileMenuOpen(false)}
                    />
                )}
                <div
                    className={`lg:hidden fixed left-0 top-20 h-full w-64 bg-white shadow-lg overflow-y-auto transition-all duration-300 ease-in-out z-40 ${mobileMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 pointer-events-none'
                        }`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="p-6">
                        <h2 className="text-sm font-semibold text-gray-800 mb-6 uppercase tracking-wider text-right">Admin Panel</h2>

                        <nav className="space-y-2">
                            {/* Update */}
                            <button
                                onClick={() => {
                                    setActiveTab('update');
                                    setMobileMenuOpen(false);
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'update'
                                    ? 'bg-[#000000] text-[#ffffff]'
                                    : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <BarChart3 size={18} />
                                <span className="text-sm font-medium">Update</span>
                            </button>

                            {/* Add New */}
                            <button
                                onClick={() => {
                                    setActiveTab('add');
                                    setMobileMenuOpen(false);
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'add'
                                    ? 'bg-[#000000] text-[#ffffff]'
                                    : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <Plus size={18} />
                                <span className="text-sm font-medium">Add New</span>
                            </button>

                            {/* Orders */}
                            <button
                                onClick={() => {
                                    setActiveTab('orders');
                                    setMobileMenuOpen(false);
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'orders'
                                    ? 'bg-[#000000] text-[#ffffff]'
                                    : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <ShoppingBag size={18} />
                                <span className="text-sm font-medium">Orders</span>
                            </button>

                            {/* Hero Images */}
                            <button
                                onClick={() => {
                                    setActiveTab('hero');
                                    setMobileMenuOpen(false);
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'hero'
                                    ? 'bg-[#000000] text-[#ffffff]'
                                    : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <Image size={18} />
                                <span className="text-sm font-medium">Hero Images</span>
                            </button>

                            {/* Carts */}
                            <button
                                onClick={() => {
                                    setActiveTab('carts');
                                    setMobileMenuOpen(false);
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'carts'
                                    ? 'bg-[#000000] text-[#ffffff]'
                                    : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <ShoppingCart size={18} />
                                <span className="text-sm font-medium">Carts</span>
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 p-4 lg:p-8 lg:mt-0 mt-16">
                    <div className="max-w-6xl">
                        {activeTab === 'update' && (
                            <UpdateProductsSection />
                        )}

                        {activeTab === 'add' && (
                            <AddProductForm />
                        )}

                        {activeTab === 'orders' && (
                            <OrdersSection />
                        )}

                        {activeTab === 'hero' && (
                            <HeroImagesSection />
                        )}

                        {activeTab === 'carts' && (
                            <CartsSection />
                        )}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
}
