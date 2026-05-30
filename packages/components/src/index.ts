/**
 * @uds/components — Universal DS React components
 *
 * Distribution model: shadcn-style (copy-paste preferred, npm-install also works).
 * Each component is independently importable to enable tree-shaking.
 *
 * Usage:
 *   import { Button } from '@uds/components';
 *   // or per-component (tree-shake optimized):
 *   import { Button } from '@uds/components/button';
 *
 * Before using: import '@uds/tokens/css' (or tokens.css) in your app root
 * to load the CSS custom properties that power all component styles.
 */

// Foundations
export { Button, buttonVariants } from './button';
export type { ButtonProps, ButtonIntent, ButtonSize } from './button';

export { Spinner, spinnerVariants } from './spinner';
export type { SpinnerProps, SpinnerSize } from './spinner';

export { Icon, iconVariants } from './icon';
export type { IconProps, IconSize } from './icon';

export { IconButton, iconButtonVariants } from './icon-button';
export type { IconButtonProps, IconButtonIntent, IconButtonSize } from './icon-button';

export { Input, inputFieldVariants } from './input';
export type { InputProps, InputSize, InputState } from './input';

export { Checkbox } from './checkbox';
export type { CheckboxProps, CheckboxSize } from './checkbox';

export { Switch } from './switch';
export type { SwitchProps, SwitchSize } from './switch';

// Composite
export { Badge, badgeVariants } from './badge';
export type { BadgeProps, BadgeSize, BadgeStyle, BadgeIntent } from './badge';

export { Avatar, avatarBodyVariants } from './avatar';
export type { AvatarProps, AvatarSize, AvatarType, AvatarStatus } from './avatar';

export { Card, cardVariants } from './card';
export type { CardProps, CardPadding, CardStyle, CardHeaderProps, CardBodyProps, CardFooterProps } from './card';

export { Tabs, tabTriggerVariants } from './tabs';
export type { TabsProps, TabsOrientation, TabsStyle, TabsSize, TabsListProps, TabsTriggerProps, TabsContentProps } from './tabs';

export { SidebarItem, sidebarItemVariants } from './sidebar-item';
export type { SidebarItemProps, SidebarItemStyle, SidebarItemMode } from './sidebar-item';

export { Sidebar, sidebarVariants } from './sidebar';
export type { SidebarProps, SidebarMode, SidebarUser } from './sidebar';

export { MenuItem, menuItemVariants } from './menu-item';
export type { MenuItemProps, MenuItemStyle, MenuItemSize, TrailingType } from './menu-item';

export { Menu } from './menu';
export type { MenuProps, MenuSize } from './menu';

export { Select, selectTriggerVariants } from './select';
export type { SelectProps, SelectSize, SelectState, SelectOption } from './select';

export { Table, tableRowVariants } from './table';
export type { TableProps, TableSize, TableRowState } from './table';

export { Pagination } from './pagination';
export type { PaginationProps, PaginationSize, PaginationStyle } from './pagination';

export { Tooltip, tooltipBodyVariants } from './tooltip';
export type { TooltipProps, TooltipSize, TooltipPosition } from './tooltip';
