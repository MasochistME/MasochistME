export type Row = {
	value: string | number;
	cell?: React.ReactNode;
};

export type Column<T> = {
	name: T;
	style?: React.CSSProperties;
};

export type Order = 'asc' | 'desc';

export type HeadCell = {
	disablePadding: boolean;
	id: string;
	label: string;
	numeric: boolean;
};
