import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const tableTopics = [
  {
    id: 1,
    title:
      "If you could have dinner with any historical figure, who would it be and why?",
    date: "2023-06-01",
    duration: "1:30",
  },
  {
    id: 2,
    title: "Describe a time when you had to think on your feet.",
    date: "2023-06-03",
    duration: "2:15",
  },
  {
    id: 3,
    title: "What's the most valuable lesson you've learned in life so far?",
    date: "2023-06-05",
    duration: "1:45",
  },
  {
    id: 4,
    title:
      "If you could instantly become an expert in one subject, what would it be?",
    date: "2023-06-07",
    duration: "2:00",
  },
  {
    id: 5,
    title: "Describe your perfect day from start to finish.",
    date: "2023-06-09",
    duration: "1:55",
  },
];

export function TableTopicsList() {
  return (
    <Table>
      <TableCaption>
        A list of your recent Table Topics recordings.
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[400px]">Topic</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tableTopics.map((topic) => (
          <TableRow key={topic.id}>
            <TableCell className="font-medium">{topic.title}</TableCell>
            <TableCell>{topic.date}</TableCell>
            <TableCell>{topic.duration}</TableCell>
            <TableCell className="text-right">
              <Button variant="outline" size="sm">
                View
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
