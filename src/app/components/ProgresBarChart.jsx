import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import dayjs from 'dayjs';

export default function ProgressLineChart({ files }) {
    const groupedByDate = {};

    files.forEach(file => {
        const date = file.created_at ? dayjs(file.created_at).format('YYYY-MM-DD') : 'unknown';
        const status = file.status || 'unknown';

        if (!groupedByDate[date]) {
            groupedByDate[date] = { date };
        }

        groupedByDate[date][status] = (groupedByDate[date][status] || 0) + 1;
    });

    const chartData = Object.values(groupedByDate).sort((a, b) => {
        if (a.date === 'unknown') return -1;
        if (b.date === 'unknown') return 1;
        return new Date(a.date) - new Date(b.date);
    });

    return (
        <div style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="completed" stroke="#8884d8" />
                    <Line type="monotone" dataKey="pending" stroke="#82ca9d" />
                    <Line type="monotone" dataKey="unknown" stroke="#d88484" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
