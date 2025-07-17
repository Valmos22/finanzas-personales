import { useEffect, useState } from "react";
import { type SubmitHandler } from "react-hook-form";
import { ActionBar } from "../../components/actionbar/ActionBar";
import FormTransaction from "../../components/formTransaction/FormTransaction";
import PaginationControl from "../../components/paginationControl/PaginationControl";
import TableFilter from "../../components/tableFilter/TableFilter";
import { useAuth } from "../../context/AuthContext";
import { ServiceTransactions } from "../../services/Transactions";
import { COLUMNS_TABLES } from "../../utils/Constants";
import type { IFormInput } from "../../utils/FormTransactionType";
import { currentData, totalPagesTable } from "../../utils/TotalPagesTable";
import type { Transaction } from "../../utils/TransactionType";
import style from "./HomeDashboard.module.css";

const HomeDashboard = () => {

    const { user } = useAuth();

    const [dataTransaction, setDataTransaction] = useState<Transaction[]>([]);
    // const [showDetail, setShowDetail] = useState(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    // const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

    // const [dataSelectedTransaction, setDataSelectedTransaction] = useState<Transaction | null>(null);
    // const [showForm, setShowForm] = useState<boolean>(false);
    // const [disableItems, setDisableItems] = useState<boolean>(false);


    const [filteredData, setFilteredData] = useState<Transaction[]>([]);
    const [filterText, setFilterText] = useState<string>("");

    const pageSize = 7;
    const { current } = currentData(filteredData, currentPage, pageSize);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await ServiceTransactions.getAll();
                console.log("Products data:", response.transactions);
                setDataTransaction(response.transactions);
                setFilteredData(response.transactions);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (filterText.trim() === "") {
            setFilteredData(dataTransaction);
        } else {
            const filtered = dataTransaction.filter((transaction) =>
                transaction.description.toLowerCase().includes(filterText.toLowerCase())
            );
            setFilteredData(filtered);
        }
    }, [filterText, dataTransaction]);

    const totalPage = totalPagesTable(filteredData.length, pageSize)

    const tableData = current.map((transaction: Transaction) => [
        transaction.id ?? 0,
        transaction.description ?? "",
        transaction.type === "expense" ? "Gasto" : "Ingreso",
        transaction.category ?? "",
        transaction.amount ?? 0,
        new Date(transaction.date ?? "").toLocaleDateString(),
        transaction?.action
            ? ""
            : <button className="focus:outline-none text-white bg-blue-700 hover:bg-blue-300 focus:ring-4 focus:ring-blue-600 font-medium rounded-lg text-sm px-5 py-2.5 dark:focus:ring-blue-700"
                type="button"
                id={`cbox-${transaction.id}`}
                onClick={() => handleRowClick(transaction.id)}
            >
                Actualizar
            </button>,
        transaction?.action
            ? ""
            : <button className="focus:outline-none text-white bg-red-700 hover:bg-red-300 focus:ring-4 focus:ring-red-600 font-medium rounded-lg text-sm px-5 py-2.5 dark:focus:ring-red-700"
                type="button"
                id={`cbox-${transaction.id}`}
                onClick={() => deleteTransaction(transaction.id)}
            >
                Eliminar
            </button>,
    ]);

    const handleRowClick = (id: (number | undefined)) => {
        const selected = current.find(p => p.id === id);
        console.log("Selected product:", selected, id);
        // if (selected) {
        //     setSelectedTransaction(selected);
        //     setShowDetail(true);
        // }
    };

    const exportCSV = async () => {
        if (!user?.id) {
            console.error("User ID is undefined. Cannot export CSV.");
            return;
        }
        try {
            const data = await ServiceTransactions.exportCSV(user.id);

            const url = window.URL.createObjectURL(new Blob([data], { type: 'text/csv' }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'transactions.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();

        } catch (error) {
            console.log(error)
        }
    }

    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        console.log(user)

        const newData: Transaction = {
            userId: user?.id ?? "",
            type: data.type,
            category: data.category,
            amount: data.amount,
            date: data.date,
            description: data.description
        }
        console.log(newData)
        try {
            const data = await ServiceTransactions.create(newData);
            console.log(data)
            if (data) {
                setDataTransaction((oldData) => [...oldData, data])
            }

        } catch (error) {
            console.log(error)
        }
    }

    const deleteTransaction = (id: number | undefined) => {
        console.log(id)
    }

    return (
        <>
            <div className="antialiased bg-gray-50 dark:bg-gray-900">
                <main className="p-4 md:ml-64 h-auto pt-20">
                    <div className="flex flex-col max-w-screen-xl mx-auto p-4 h-screen">
                        <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
                        <p className="text-lg">Welcome to your dashboard!</p>

                        <div className="">
                            <FormTransaction onSubmit={onSubmit} />
                        </div>
                        {/* 
                        <div>
                            <GraficBar data={dataTransaction} />
                        </div> */}

                        <div className={`${style.container_tablet}`}>
                            <ActionBar
                                action={() => { }}
                                filterText={filterText}
                                onFilterChange={setFilterText}
                            />
                            <br />
                            <TableFilter
                                columns={COLUMNS_TABLES.TRANSACTIONS}
                                rows={tableData}
                            />
                            <PaginationControl currentPage={currentPage} setCurrentPage={setCurrentPage} totalPage={totalPage} />
                        </div>

                        <div>
                            <button className="focus:outline-none text-white bg-yellow-700 hover:bg-yellow-300 focus:ring-4 focus:ring-yellow-600 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-700" onClick={exportCSV}>Exportar</button>
                        </div>

                    </div>
                </main>
            </div>
        </>
    )
}

export default HomeDashboard