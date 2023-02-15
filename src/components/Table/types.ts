export type Order = 'asc' | 'desc';

export type TableHeaderCell = {
	disablePadding: boolean;
	id: string;
	label: React.ReactNode;
	numeric: boolean;
};

export type TableColumn<T> = {
	key: string;
	title: React.ReactNode;
	value: (item: T, index: number) => string | number;
	render: (item: T, index: number) => React.ReactNode;
	style?: React.CSSProperties;
};

export type TableRow = {
	key: string;
	value: string | number;
	cell: React.ReactNode;
};
