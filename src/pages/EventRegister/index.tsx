import { FormProvider, useForm, SubmitHandler } from "react-hook-form";
import { EventForm } from "./EventForm/EventForm";
import { CustomButton } from "@/atoms/CustomButton";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import type { FormattedDateTime, RegistrationFormData } from "@/types";
import Step from "@/components/ui/step";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/useAuth";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { message } from "antd";
import { getAuth } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import Modal from "@/components/ui/modal";
import RightsideDetails from "./RightsideDetails";

type FirstStepFields = Pick<
  RegistrationFormData,
  "firstname" | "lastname" | "jobTitle" | "experience" | "email" | "phone"
>;

export default function EventRegister() {
  const [step, setStep] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const { user, loading: authLoading } = useAuth();

  const methods = useForm<RegistrationFormData>({
    mode: "onTouched",
    reValidateMode: "onSubmit",
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      phone: "",
      jobTitle: "",
      experience: "",
      notify: "",
      interestedField: "",
      hopes: "",
      additionalInfo: "",
      eventDetails: {
        title: location.state?.title || "Event",
        date: {
          seconds: location.state?.date?.seconds || 0,
          nanoseconds: location.state?.date?.nanoseconds || 0,
        },
        eventLocation: location.state?.location || "Unknown",
      },
    },
  });

  const state = location.state as
    | {
        title: string;
        date: { seconds: number; nanoseconds: number };
        location: string;
        imageUrl: string;
        author: string;
        eventRoom: string;
        isFull: boolean;
      }
    | undefined;

  const title = state?.title || "Event";
  const eventRoom = state?.eventRoom;
  const eventLocation = state?.location || "Unknown";
  const imageSource = state?.imageUrl || "/pastEvents/past1.jpeg";
  const organizer = state?.author || "KO'DJ";

  const {
    handleSubmit,
    watch,
    trigger,
    reset,
    formState: { errors },
  } = methods;

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  const handleClick = () => {
    setIsModalOpen(false);
    navigate("/");
  };

  const onSubmit: SubmitHandler<RegistrationFormData> = async (data) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        console.error("User is not logged in.");
        alert("You need to be logged in to register for the event.");
        navigate("/login");
        return;
      }

      const registrationRef = collection(db, "registrations");
      const q = query(
        registrationRef,
        where("uid", "==", user.uid),
        where("eventDetails.title", "==", data.eventDetails.title)
      );

      const registrationSnapshot = await getDocs(q);
      if (!registrationSnapshot.empty) {
        messageApi.error("You have already registered for the event.");
        return;
      }

      const idToken = await user.getIdToken();

      const response = await fetch(import.meta.env.VITE_FIREBASE_FUNCTION_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          ...data,
          eventId: id,
        }),
      });

      if (response.ok) {
        setIsModalOpen(true);
        reset();
        setStep(1);
      } else {
        let errorMessage = "An error occurred";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (err) {
          console.error("Error parsing error response:", err);
        }
        alert(`Error: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Error registering user: ", error);
      alert("An error occurred. Please try again later.");
    }
  };

  const handleBack = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (step > 1) setStep(step - 1);
  };

  const handleNext = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (step === 1) {
      const fieldsToValidate: (keyof FirstStepFields)[] = [
        "firstname",
        "lastname",
        "jobTitle",
        "experience",
        "email",
        "phone",
      ];

      const isStepValid = await trigger(fieldsToValidate, {
        shouldFocus: true,
      });

      if (!isStepValid) {
        fieldsToValidate.forEach(async (field) => {
          await trigger(field);
        });
        return;
      }
    }

    if (step < 2) setStep(step + 1);
  };

  const isStepOneValid = () => {
    const firstname = watch("firstname");
    const lastname = watch("lastname");
    const jobTitle = watch("jobTitle");
    const experience = watch("experience");
    const email = watch("email");
    const phone = watch("phone");

    return (
      firstname &&
      firstname.length >= 2 &&
      lastname &&
      jobTitle &&
      experience &&
      email &&
      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email) &&
      phone &&
      /^\d{3}-\d{4}-\d{4}$/.test(phone) &&
      Object.keys(errors).length === 0
    );
  };

  const formatDate = (
    firebaseDate: { seconds: number; nanoseconds: number } | string
  ): FormattedDateTime => {
    if (typeof firebaseDate === "string") {
      return {
        date: "No date found",
        time: "No time found",
      };
    }

    const date = new Date(firebaseDate.seconds * 1000);

    const formattedDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const formattedTime = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    return {
      date: formattedDate,
      time: formattedTime,
    };
  };

  const { date: formattedDate } = formatDate(
    location.state?.date || "No Date Found"
  );

  return (
    <>
      {contextHolder}
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col md:flex-row min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4 sm:p-8 rounded-lg text-gray-300 shadow-lg space-y-4 md:space-y-0">
            <div className="w-full md:w-1/2 p-6 bg-opacity-80">
              <div className="w-full bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg shadow-lg">
                <div className="flex justify-between rounded p-8">
                  <Step step={1} currentStep={step} />
                  <Step step={2} currentStep={step} />
                </div>

                <div className="space-y-4 px-8 py-6">
                  <EventForm currentStep={step} />
                </div>

                <div className="px-8 pb-8">
                  <div className="mt-10 flex justify-between">
                    <CustomButton
                      variant="secondary"
                      onClick={handleBack}
                      disabled={step === 1}
                    >
                      Back
                    </CustomButton>

                    {step === 2 ? (
                      <CustomButton
                        type="submit"
                        icon={<FaArrowUpRightFromSquare className="text-xs" />}
                      >
                        Register
                      </CustomButton>
                    ) : (
                      <CustomButton
                        onClick={handleNext}
                        disabled={!isStepOneValid()}
                      >
                        Continue
                      </CustomButton>
                    )}

                  </div>
                </div>
              </div>
            </div>
            {/* // this is the right side of the event resgiter form preview */}
            <RightsideDetails
              imageSource={imageSource}
              title={title}
              formattedDate={formattedDate}
              organizer={organizer}
              eventLocation={eventLocation}
              eventRoom={eventRoom || "Unknown"}
            />
          </div>
        </form>
        {isModalOpen && (
          <Modal onClose={() => setIsModalOpen(false)}>
            <div className="p-8 bg-gray-800 rounded-lg text-gray-200">
              <h2 className="text-2xl font-bold text-blue-400 mb-4">
                Registration Successful
              </h2>
              <p className="text-gray-400">
                Your registration for{" "}
                <strong>{methods.getValues("eventDetails.title")}</strong> has
                been submitted successfully.
              </p>
              <p className="text-gray-600 mb-6 text-center">
                We look forward to seeing you at the event.
              </p>
              <div className="flex justify-center">
                <CustomButton onClick={handleClick}>OK</CustomButton>
              </div>
            </div>
          </Modal>
        )}
      </FormProvider>
    </>
  );
}
