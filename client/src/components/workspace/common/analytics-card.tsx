import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowBigUp, ArrowBigDown, Loader } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

const AnalyticsCard = (props: {
  title: string;
  value: number;
  isLoading: boolean;
  setChart: Dispatch<SetStateAction<boolean>>;
  gradient: string;

}) => {

  const { gradient, setChart, title, value, isLoading } = props;

  const getArrowIcon = () => {
    if (title === "Overdue" || title === "Active Tasks" || title === "Due Today" || title === "In Review") {
      return value > 0 ? (
        <ArrowBigDown strokeWidth={2.5} className="h-6 w-6 text-red-600 fill-red-600" />
      ) : (
        <ArrowBigUp strokeWidth={2.5} className="h-6 w-6 text-lime-500 fill-lime-500" />
      );
    }
    if (title === "Weekly Completed") {
      return value > 0 ? (
        <ArrowBigUp strokeWidth={2.5} className="h-6 w-6 text-lime-500 fill-lime-500" />
      ) : null
    }
    return null;
  };



  return (
    <Card className={`shadow-slate-300 dark:shadow-gray-700 w-full bg-gradient-to-r ${gradient}`} onClick={() => (setChart(true))}>

      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 ">
        <div className="flex items-center gap-1">
          <CardTitle className="text-sm italic font-medium text-neutral-50">{title}</CardTitle>
          <div className="mb-px">{getArrowIcon()}</div>
        </div>
      </CardHeader>

      <CardContent className="w-full">
        <div className="text-3xl font-bold text-neutral-50">
          {isLoading ? <Loader className="w-6 h-6 animate-spin" /> : value}
        </div>
      </CardContent>

    </Card>
  );
};

export default AnalyticsCard;
