import { motion } from 'framer-motion';

export interface EventSlot {
    subject: string;
    location: string;
    time: string;
    presentations: {
        title: string;
        company: string;
        presenter: string;
    }[];
}

export default function EventSchedule({ schedule }: { schedule: EventSlot[] }) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg text-gray-200 mt-8">
        <h2 className="text-2xl font-bold text-blue-500 mb-6">
          {/* <IoMdTime className="inline-block text-2xl mr-2 mt-1" /> */}
          Keynote Schedule:
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left table-fixed border-collapse border-t border-b border-gray-700">
            <thead className="bg-white-900">
              <tr>
                <th className="p-3 text-gray-500 font-medium border border-gray-700 first:border-l-0 last:border-r-0">Subject</th>
                <th className="p-3 text-gray-500 font-medium border border-gray-700 first:border-l-0 last:border-r-0">Time</th>
                <th className="p-3 text-gray-500 font-medium border border-gray-700 first:border-l-0 last:border-r-0">Presentation Title</th>
                <th className="p-3 text-gray-500 font-medium border border-gray-700 first:border-l-0 last:border-r-0">Company</th>
                <th className="p-3 text-gray-500 font-medium border border-gray-700 first:border-l-0 last:border-r-0">Presenter</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((slot, index) => (
                <motion.tr
                  key={index}
                  whileHover={{ scale: 1.01 }}
                  className="hover:bg-gray-700 transition-colors duration-200"
                >
                  <td className="p-4 border border-gray-700 text-white-400 font-semibold first:border-l-0 last:border-r-0">
                    <div className="flex flex-col">
                      <span>{slot.subject}</span>
                      <span className="text-gray-500 text-sm">{slot.location}</span>
                    </div>
                  </td>
                  <td className="p-4 border border-gray-700 text-lg font-medium text-red-500 whitespace-nowrap first:border-l-0 last:border-r-0">
                    {slot.time}
                  </td>
                  <td className="p-4 border border-gray-700 first:border-l-0 last:border-r-0">
                    {slot.presentations.map((presentation, i) => (
                      <div key={i} className="mb-2 last:mb-0">
                        <p className="text-gray-100 font-semibold">{presentation.title}</p>
                      </div>
                    ))}
                  </td>
                  <td className="p-4 border border-gray-700 first:border-l-0 last:border-r-0">
                    {slot.presentations.map((presentation, i) => (
                      <div key={i} className="mb-2 last:mb-0 text-white-600">
                        {presentation.company}
                      </div>
                    ))}
                  </td>
                  <td className="p-4 border border-gray-700 first:border-l-0 last:border-r-0">
                    {slot.presentations.map((presentation, i) => (
                      <div key={i} className="mb-2 last:mb-0 text-white-600">
                        {presentation.presenter}
                      </div>
                    ))}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
}