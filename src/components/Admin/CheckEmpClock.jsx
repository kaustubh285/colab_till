import React from 'react';
import AdminNav from './AdminNav';

const CheckEmpClock = () => {
    const [employeeTable, setEmployeeTable] = React.useState([]);
    const [startDate, setStartDate] = React.useState(() => {
        const date = new Date();
        date.setDate(date.getDate() - 7);
        return date.toISOString().split('T')[0]; // Default to 1 week ago
    });
    const [endDate, setEndDate] = React.useState(() => {
        return new Date().toISOString().split('T')[0]; // Default to today
    });

    const formatDateToMMDDYYYY = (dateString) => {
        const [year, month, day] = dateString.split('-');
        return `${month}-${day}-${year}`;
    };

    const getEmpInfo = async (start, end) => {
        const formattedStart = formatDateToMMDDYYYY(start);
        const formattedEnd = formatDateToMMDDYYYY(end);
        try {
            const response = await fetch(
                `http://localhost:8000/employee/get-clock-for-dates/?start_date=${formattedStart}&end_date=${formattedEnd}`,
            );
            const results = await response.json();
            setEmployeeTable(results['employee_info']);
        } catch (error) {
            console.error('Error fetching employee info:', error);
        }
    };

    React.useEffect(() => {
        handleSubmit();
    }, [startDate, endDate]);

    const onDateChange = (val, name) => {
        if (name === 'start') {
            setStartDate(val);
        } else if (name === 'end') {
            setEndDate(val);
        }
    };

    const handleSubmit = () => {
        // e.preventDefault();
        const diffInMonths =
            (new Date(endDate) - new Date(startDate)) /
            (1000 * 60 * 60 * 24 * 30);

        if (diffInMonths > 2) {
            alert('Date range cannot be more than 2 months');
            return;
        }
        getEmpInfo(startDate, endDate); // Fetch data without navigation
    };
    return (
        <>
            <div class="flex-1 bg-white p-5">
                <div class="header flex flex-wrap items-center justify-between mb-8">
                    <p class="text-xl font-semibold">
                        Attendance: Employee Clock-ins & Clock-outs
                    </p>
                    <form class="flex flex-wrap items-stretch justify-center space-x-6 mb-3">
                        <div class="min-w-68 flex items-center justify-center space-x-2 px-4 py-3 bg-slate-100 font-semibold cursor-pointer">
                            <span>From :</span>
                            <div class="relative max-w-sm">
                                <input
                                    id="start_date"
                                    type="date"
                                    value={startDate}
                                    onChange={(e) =>
                                        onDateChange(e.target.value, 'start')
                                    }
                                    class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block mt-0 w-full ps-10 p-2.5 "
                                    placeholder="Select date"
                                />
                            </div>
                        </div>
                        <div class="min-w-68 flex items-center space-x-2 px-4 py-3 bg-slate-100 font-semibold cursor-pointer">
                            <span>To :</span>
                            <div class="relative max-w-sm">
                                <input
                                    datepicker
                                    id="end_date"
                                    type="date"
                                    value={endDate}
                                    onChange={(e) =>
                                        onDateChange(e.target.value, 'end')
                                    }
                                    class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block mt-0 w-full ps-10 p-2.5 "
                                    placeholder="Select date"
                                />
                            </div>
                        </div>
                    </form>
                </div>

                {employeeTable.length === 0 ? (
                    <div className=" w-full px-4 py-5 text-red-800 bg-red-200 text-center">
                        No data
                    </div>
                ) : (
                    <div class="relative overflow-x-auto shadow-lg">
                        <table class="w-full text-sm text-left rtl:text-right text-gray-500 ">
                            <thead class="text-xs text-gray-50 uppercase bg-gray-700 ">
                                <tr>
                                    <th scope="col" class="px-6 py-3">
                                        Date
                                    </th>
                                    <th scope="col" class="px-6 py-3">
                                        Employee
                                    </th>
                                    <th scope="col" class="px-6 py-3">
                                        Till-code
                                    </th>
                                    <th scope="col" class="px-6 py-3">
                                        Clock - in
                                    </th>

                                    <th scope="col" class="px-6 py-3">
                                        Clock - out
                                    </th>

                                    <th scope="col" class="px-6 py-3">
                                        Hours worked
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {employeeTable.map((entries) => (
                                    <tr class="bg-white border-b  hover:bg-gray-50 cursor-pointer">
                                        <td class="px-6 py-4">
                                            {entries.date}
                                        </td>

                                        <th
                                            scope="row"
                                            class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
                                        >
                                            {entries.emp_name}
                                        </th>
                                        <td class="px-6 py-4">
                                            {entries.till_code}
                                        </td>
                                        <td class="px-6 py-4">
                                            {entries.clock_in}
                                        </td>
                                        <td class="px-6 py-4">
                                            {entries.clock_out}
                                        </td>
                                        <td class="px-6 py-4">
                                            {entries.hours_worked}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
};

export default CheckEmpClock;
