import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar as CalendarIcon, Download, Wallet } from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardTopbarRight from "@/components/layout/DashboardTopbarRight";
import { useActiveNav } from "@/hooks/useActiveNav";
import { BRAND } from "@/constants/branding";
import { cn } from "@/lib/utils";

type TransactionAction = "added" | "removed" | "consumed";

interface TokenTransaction {
  id: string;
  timestamp: Date;
  action: TransactionAction;
  amount: number;
  description: string;
}

// Mock data - transactions in descending order (most recent first)
const generateMockTransactions = (): TokenTransaction[] => {
  const actions: TransactionAction[] = ["added", "removed", "consumed"];
  const descriptions = [
    "Initial budget allocation for Q1 2025",
    "Project completion: Summer Campaign 2025",
    "Budget adjustment: Marketing reallocation",
    "Project: W Summer Festival 2025 - Asset creation",
    "Project: Fold Toolkit Q3 2025 - Video production",
    "Budget top-up: Additional campaign funding",
    "Project: Promotional Campaign - Master KV creation",
    "Project cancellation: Unused tokens returned",
    "Project: BAU Campaign - Static KV adaptation",
    "Budget reduction: Cost optimization",
    "Project: Flagship Campaign - Animation creation",
    "Project: Social Content - Asset adaptation",
    "Budget adjustment: Quarterly review",
    "Project: Digital POS - Master KV creation",
    "Project: POS Campaign - Roundel creation",
    "Budget allocation: New client onboarding",
    "Project: Feature Asset - Video creation",
    "Project: Partnerships - Asset adaptation",
    "Budget top-up: Year-end allocation",
    "Project: Promotional Campaign - PPT files",
    "Project: BAU Campaign - Urgency tag creation",
    "Budget adjustment: Department reallocation",
    "Project: Flagship Campaign - Watermarked files",
    "Project: Social Content - Video adaptation",
    "Budget reduction: Budget constraints",
    "Project: Digital POS - Animation adaptation",
    "Project: POS Campaign - Master KV creation",
    "Budget top-up: Campaign expansion",
    "Project: Feature Asset - Static KV adaptation",
    "Project: Partnerships - Master KV creation",
    "Budget adjustment: Strategic reallocation",
    "Project: Promotional Campaign - Roundel creation",
    "Project: BAU Campaign - Video creation",
    "Budget top-up: Q2 2025 allocation",
    "Project: Flagship Campaign - PPT files",
    "Project: Social Content - Urgency tag creation",
    "Budget reduction: Cost savings",
    "Project: Digital POS - Watermarked files",
    "Project: POS Campaign - Video adaptation",
    "Budget allocation: New project funding",
    "Project: Feature Asset - Animation creation",
    "Project: Partnerships - Static KV adaptation",
    "Budget adjustment: Monthly review",
    "Project: Promotional Campaign - Master KV creation",
    "Project: BAU Campaign - Asset adaptation",
    "Budget top-up: Additional resources",
    "Project: Flagship Campaign - Roundel creation",
    "Project: Social Content - Video creation",
    "Budget reduction: Budget optimization",
    "Project: Digital POS - PPT files",
  ];

  const transactions: TokenTransaction[] = [];
  const now = new Date();

  for (let i = 0; i < 50; i++) {
    const daysAgo = Math.floor(Math.random() * 180); // Last 6 months
    const timestamp = new Date(now);
    timestamp.setDate(timestamp.getDate() - daysAgo);
    timestamp.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60), 0, 0);

    const action = actions[Math.floor(Math.random() * actions.length)];
    let amount: number;
    
    if (action === "added") {
      amount = Math.floor(Math.random() * 5000) + 1000; // 1000-6000 tokens
    } else if (action === "removed") {
      amount = Math.floor(Math.random() * 3000) + 500; // 500-3500 tokens
    } else {
      amount = Math.floor(Math.random() * 2000) + 100; // 100-2100 tokens
    }

    transactions.push({
      id: `txn-${i + 1}`,
      timestamp,
      action,
      amount,
      description: descriptions[i % descriptions.length],
    });
  }

  // Sort by timestamp descending (most recent first)
  return transactions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

export default function TokenTransactionsPage() {
  const navigate = useNavigate();
  const { activeName } = useActiveNav();
  const [transactions] = useState<TokenTransaction[]>(generateMockTransactions());
  const [selectedAction, setSelectedAction] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Mock token balance data
  const tokenBalance = {
    remaining: 4500,
  };

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    let filtered = transactions;

    // Filter by action type
    if (selectedAction !== "all") {
      filtered = filtered.filter((txn) => txn.action === selectedAction);
    }

    // Filter by date range
    if (dateFrom) {
      filtered = filtered.filter((txn) => txn.timestamp >= dateFrom);
    }
    if (dateTo) {
      const endDate = new Date(dateTo);
      endDate.setHours(23, 59, 59, 999); // Include entire end date
      filtered = filtered.filter((txn) => txn.timestamp <= endDate);
    }

    return filtered;
  }, [transactions, selectedAction, dateFrom, dateTo]);

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTransactions.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTransactions, currentPage]);

  const handleClearFilters = () => {
    setSelectedAction("all");
    setDateFrom(undefined);
    setDateTo(undefined);
    setCurrentPage(1);
  };

  const hasActiveFilters = selectedAction !== "all" || dateFrom || dateTo;

  const getActionBadgeVariant = (action: TransactionAction) => {
    switch (action) {
      case "added":
        return "default";
      case "removed":
        return "destructive";
      case "consumed":
        return "secondary";
      default:
        return "default";
    }
  };

  const getActionLabel = (action: TransactionAction) => {
    switch (action) {
      case "added":
        return "Added";
      case "removed":
        return "Removed";
      case "consumed":
        return "Consumed";
      default:
        return action;
    }
  };

  // Download CSV function
  const handleDownload = () => {
    const csvHeaders = ["Timestamp", "Action", "Amount", "Description"];
    const csvRows = filteredTransactions.map((txn) => [
      format(txn.timestamp, "MMM dd, yyyy HH:mm"),
      getActionLabel(txn.action),
      `${txn.action === "added" ? "+" : "-"}${txn.amount.toLocaleString()}`,
      txn.description,
    ]);

    const csvContent = [
      csvHeaders.join(","),
      ...csvRows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `token-transactions-${format(new Date(), "yyyy-MM-dd")}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const logoImage = BRAND.logo;
  const logoDot = BRAND.logoDot;

  const titleNode = (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate("/dashboard/tracker")}
        className="p-0 h-auto hover:bg-transparent -ml-2"
      >
        <ArrowLeft className="h-5 w-5 text-black" />
      </Button>
      <span className="text-sm leading-[19.6px] text-black">Token Transactions</span>
    </div>
  );

  const topbarRight = <DashboardTopbarRight />;

  return (
    <DashboardLayout
      title={titleNode}
      logoSrc={logoImage}
      logoDotSrc={logoDot}
      TopbarRight={topbarRight}
    >
      <div className="px-4 md:px-6 lg:px-8 py-6">
        {/* Token Balance Card */}
        <Card className="border border-[#ececec] bg-white mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Wallet size={20} className="text-[#03b3e2]" />
              <div>
                <div className="text-sm text-[#646464] mb-1">Token Balance</div>
                <div className="text-2xl font-bold text-[#03b3e2]">
                  {tokenBalance.remaining.toLocaleString()} tokens
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transactions Card */}
        <Card className="border border-[#ececec] bg-white">
            <CardHeader className="pb-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <CardTitle className="text-base font-bold leading-[21.28px] text-black">
                  Transaction History
                </CardTitle>
                
                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3">
                  {/* Action Type Filter */}
                  <Select value={selectedAction} onValueChange={setSelectedAction}>
                    <SelectTrigger className="w-[150px] border-[#e0e0e0] rounded-md px-3 py-2 h-auto bg-white [&_span]:text-black [&>svg]:text-black">
                      <SelectValue placeholder="All actions" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="all" className="text-black">All actions</SelectItem>
                      <SelectItem value="added" className="text-black">Added</SelectItem>
                      <SelectItem value="removed" className="text-black">Removed</SelectItem>
                      <SelectItem value="consumed" className="text-black">Consumed</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Date From Filter */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-[150px] justify-start text-left font-normal border-[#e0e0e0] bg-white text-black hover:bg-white",
                          !dateFrom && "text-[#646464]"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateFrom ? format(dateFrom, "MMM dd, yyyy") : "From date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-white" align="start">
                      <Calendar
                        mode="single"
                        selected={dateFrom}
                        onSelect={setDateFrom}
                        initialFocus
                        classNames={{
                          day: "text-black hover:bg-[#f5f5f5]",
                          day_selected: "bg-[#03b3e2] text-white hover:bg-[#03b3e2]",
                          day_today: "bg-[#f5f5f5] text-black",
                        }}
                      />
                    </PopoverContent>
                  </Popover>

                  {/* Date To Filter */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-[150px] justify-start text-left font-normal border-[#e0e0e0] bg-white text-black hover:bg-white",
                          !dateTo && "text-[#646464]"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateTo ? format(dateTo, "MMM dd, yyyy") : "To date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-white" align="start">
                      <Calendar
                        mode="single"
                        selected={dateTo}
                        onSelect={setDateTo}
                        initialFocus
                        classNames={{
                          day: "text-black hover:bg-[#f5f5f5]",
                          day_selected: "bg-[#03b3e2] text-white hover:bg-[#03b3e2]",
                          day_today: "bg-[#f5f5f5] text-black",
                        }}
                      />
                    </PopoverContent>
                  </Popover>

                  {/* Download Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownload}
                    className="border-[#e0e0e0] bg-white text-black hover:bg-[#f5f5f5]"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>

                  {/* Clear Filters Button */}
                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearFilters}
                      className="text-[#646464] hover:text-black"
                    >
                      Clear filters
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {/* Results Count */}
              <div className="mb-4 text-sm text-[#646464]">
                Showing {paginatedTransactions.length} of {filteredTransactions.length} transactions
              </div>

              {/* Transactions Table */}
              <div className="border border-[#ececec] rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-[#f5f5f5] hover:bg-[#f5f5f5]">
                      <TableHead className="px-4 py-3 text-black font-semibold text-sm">Timestamp</TableHead>
                      <TableHead className="px-4 py-3 text-black font-semibold text-sm">Action</TableHead>
                      <TableHead className="px-4 py-3 text-black font-semibold text-sm text-right">Amount</TableHead>
                      <TableHead className="px-4 py-3 text-black font-semibold text-sm">Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedTransactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="px-4 py-8 text-center text-[#646464]">
                          No transactions found matching your filters.
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedTransactions.map((transaction) => (
                        <TableRow key={transaction.id} className="hover:bg-[#f9f9f9]">
                          <TableCell className="px-4 py-4 text-black text-sm">
                            {format(transaction.timestamp, "MMM dd, yyyy HH:mm")}
                          </TableCell>
                          <TableCell className="px-4 py-4">
                            <Badge variant={getActionBadgeVariant(transaction.action)}>
                              {getActionLabel(transaction.action)}
                            </Badge>
                          </TableCell>
                          <TableCell className="px-4 py-4 text-black text-sm text-right font-medium">
                            {transaction.action === "added" ? "+" : transaction.action === "removed" ? "-" : "-"}
                            {transaction.amount.toLocaleString()} tokens
                          </TableCell>
                          <TableCell className="px-4 py-4 text-black text-sm">
                            {transaction.description}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-[#646464]">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="border-[#e0e0e0] bg-white text-black hover:bg-white disabled:opacity-50"
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="border-[#e0e0e0] bg-white text-black hover:bg-white disabled:opacity-50"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
      </div>
    </DashboardLayout>
  );
}

