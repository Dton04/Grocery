// ============================================
// COMMON TYPES - Các kiểu dữ liệu chung cho toàn dự án
// ============================================

/**
 * UNION TYPES - Kiểu dữ liệu có giá trị cố định
 */

/**
 * Trạng thái đơn hàng
 * - pending: Chờ xử lý
 * - processing: Đang xử lý
 * - shipped: Đã giao cho vận chuyển
 * - delivered: Đã giao hàng
 * - cancelled: Đã hủy
 */
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

/**
 * Phương thức thanh toán
 * - cash: Tiền mặt
 * - card: Thẻ ngân hàng
 * - momo: Ví MoMo
 * - zalopay: Ví ZaloPay
 */
export type PaymentMethod = 'cash' | 'card' | 'momo' | 'zalopay'

/**
 * Vai trò người dùng
 * - customer: Khách hàng
 * - admin: Quản trị viên
 * - staff: Nhân viên
 */
export type UserRole = 'customer' | 'admin' | 'staff'

/**
 * Trạng thái sản phẩm
 */
export type ProductStatus = 'in-stock' | 'out-of-stock' | 'discontinued'

// Đơn vị sản phẩm
export type ProductUnit = 'kg' | 'gói' | 'chai' | 'lon' | 'bịch' | 'thùng' | 'cái' | 'bộ'


