export type Order = 'asc' | 'desc';

export type TableHeaderCell = {
	disablePadding: boolean;
	id: string;
	label: React.ReactNode;
	numeric: boolean;
};

export type TableColumn = {
	key: string;
	title: React.ReactNode;
	value: string | number;
	cell: React.ReactNode;
	style?: React.CSSProperties;
};

export type TableRow = {
	key: string;
	value: string | number;
	cell?: React.ReactNode;
};
