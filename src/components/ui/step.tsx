import { motion } from "framer-motion";
import { ComponentProps } from "react";

const Step = ({ step, currentStep }: { step: number; currentStep: number }) => {
  const status =
    currentStep === step
      ? "active"
      : currentStep < step
      ? "inactive"
      : "complete";

  return (
    <motion.div animate={status} className="relative">
      <motion.div
        variants={{
          active: {
            scale: 1,
            transition: {
              delay: 0,
              duration: 0.2,
            },
          },
          complete: {
            scale: 1.25,
          },
        }}
        transition={{
          duration: 0.6,
          delay: 0.2,
          type: "tween",
          ease: "circOut",
        }}
        className="absolute inset-0 rounded-full bg-blue-200"
      />

      <motion.div
        initial={false}
        variants={{
          inactive: {
            backgroundColor: "#fff", // neutral
            borderColor: "#e5e5e5", // neutral-200
            color: "#a3a3a3", // neutral-400
          },
          active: {
            backgroundColor: "#fff",
            borderColor: "#3b82f6", // blue-500
            color: "#3b82f6", // blue-500
          },
          complete: {
            backgroundColor: "#3b82f6", // blue-500
            borderColor: "#3b82f6", // blue-500
            color: "#3b82f6", // blue-500
          },
        }}
        transition={{ duration: 0.2 }}
        className="relative flex h-10 w-10 items-center justify-center rounded-full border-2 font-semibold"
      >
        <div className="flex items-center justify-center">
          {status === "complete" ? (
            <CheckIcon className="h-6 w-6 text-white" />
          ) : (
            <span>{step}</span>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

const CheckIcon = (props: ComponentProps<"svg">) => {
  return (
    <svg
      {...props}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={3}
    >
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{
          delay: 0.2,
          type: "tween",
          ease: "easeOut",
          duration: 0.3,
        }}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}


export default Step;