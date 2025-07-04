import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FormProvider, useForm, SubmitHandler } from 'react-hook-form';
import { FaArrowUpRightFromSquare } from 'react-icons/fa6';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { message } from 'antd';
import { useTranslation } from 'react-i18next';
import themeColors from '@/tools/themeColors';
import { RegistrationFormData } from '@/types';
import Button from '@/components/Button/Button';
import useAuth from '@/context/useAuth';
import EventForm from '@/pages/Events/EventRegister/EventForm';
import Step from '@/components/ProgressBar/Step';
import useApiService from '@/services';
import { ApiResponse } from '@/types/fetch';
import { EventRegistrationData, EventRegistrationResponse } from '@/types/user';
import ConfirmModal from '@/components/Modal/ModalTypes/ConfirmModal';
import RightSideDetails from '@/pages/Events/EventRegister/RightSideDetails';
import InfoModal from '@/components/Modal/ModalTypes/InfoModal';

type FirstStepFields = Pick<
    RegistrationFormData,
    'firstName' | 'lastName' | 'jobTitle' | 'experience' | 'email' | 'phone'
>;

type FormattedDateTime = {
    date: string;
    time: string;
};

const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    justify-content: flex-start;
    align-items: stretch;
    max-width: 112rem;
    margin: 0 auto;
    gap: ${themeColors.spacing.lg};
    border-radius: ${themeColors.radiusSizes.lg};
    color: ${themeColors.white_dark};

    @media (min-width: ${themeColors.breakpoints.tablet}) {
        flex-direction: row;
        gap: ${themeColors.spacing.lg};
    }
`;

const FormSection = styled.div`
    width: 100%;
    background: rgba(0, 0, 0, 0.8);
    max-width: 32rem;

    @media (min-width: ${themeColors.breakpoints.tablet}) {
        width: 50%;
        max-width: 40rem;
    }
`;

const ButtonWrapper = styled.div`
    margin-top: ${themeColors.spacing.xl};
    display: flex;
    justify-content: space-between;
    gap: ${themeColors.spacing.sm};

    @media (max-width: ${themeColors.breakpoints.mobile}) {
        flex-direction: column;
        gap: ${themeColors.spacing.md};
    }
`;

const FormCard = styled.div`
    width: 100%;
    background: linear-gradient(to right, ${themeColors.gray_background}, ${themeColors.gray_dark});
    border-radius: ${themeColors.radiusSizes.xl};
    box-shadow: ${themeColors.shadow_clicked};
    border: 1px solid ${themeColors.cardBorder.color};
    overflow: hidden;
    transition: all ${themeColors.duration};

    &:hover {
        box-shadow: ${themeColors.shadow_clicked};
    }
`;

const StepperContainer = styled.div`
    display: flex;
    justify-content: space-between;
    border-radius: ${themeColors.radiusSizes.md};
    padding: ${themeColors.spacing.xl} ${themeColors.spacing.md};

    @media (min-width: ${themeColors.breakpoints.tablet}) {
        padding: ${themeColors.spacing.xl} ${themeColors.spacing.xl};
    }
`;

const StepperWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
`;

const ProgressLine = styled.div<{ isCompleted: boolean }>`
    flex: 1;
    margin: 0 ${themeColors.spacing.sm};
    height: 4px;
    background-color: ${({ isCompleted }) => (isCompleted ? themeColors.blue : themeColors.gray_text)};
`;

const FormContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${themeColors.spacing.sm};
    padding: ${themeColors.spacing.sm} ${themeColors.spacing.md};

    @media (min-width: ${themeColors.breakpoints.laptop}) {
        flex-direction: row;

        gap: ${themeColors.spacing.md};
        padding: 0 ${themeColors.spacing.xl} ${themeColors.spacing.lg};
    }
`;

const ButtonContainer = styled.div`
    padding: ${themeColors.spacing.xl} ${themeColors.spacing.md};

    @media (min-width: ${themeColors.breakpoints.laptop}) {
        padding: 0 ${themeColors.spacing.xl} ${themeColors.spacing.xl};
    }
`;

const formatDate = (firebaseDate: { seconds: number; nanoseconds: number } | string | undefined): FormattedDateTime => {
    if (!firebaseDate) {
        return {
            date: 'No date found',
            time: 'No time found',
        };
    }

    if (typeof firebaseDate === 'string') {
        return {
            date: firebaseDate,
            time: 'Time not specified',
        };
    }

    const date = new Date(firebaseDate.seconds * 1000);

    const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const formattedTime = date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });

    return {
        date: formattedDate,
        time: formattedTime,
    };
};

export default function EventRegister() {
    const [step, setStep] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { eventId } = useParams<{ eventId: string }>();
    const location = useLocation();
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const { user } = useAuth();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    const registerEventService = useApiService();
    const { t } = useTranslation('eventRegister');

    const methods = useForm<RegistrationFormData>({
        mode: 'onChange',
        reValidateMode: 'onChange',
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            jobTitle: '',
            experience: '',
            notify: '',
            interestedField: '',
            hopes: '',
            additionalInfo: '',
            eventDetails: {
                title: location.state?.title || 'Event',
                date: {
                    seconds: location.state?.date?.seconds || 0,
                    nanoseconds: location.state?.date?.nanoseconds || 0,
                },
                eventLocation: location.state?.location || 'Unknown',
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

    const title = state?.title || 'Event';
    const eventRoom = state?.eventRoom;
    const eventLocation = state?.location || 'Unknown';
    const imageSource = state?.imageUrl || '/pastEvents/past1.jpeg';
    const organizer = state?.author || "KO'DJ";

    const { handleSubmit, trigger, reset } = methods;

    useEffect(() => {
        const pendingRegistration = localStorage.getItem('pendingEventRegistration');

        if (user && pendingRegistration) {
            localStorage.removeItem('pendingEventRegistration');
        } else if (!user) {
            setIsLoginModalOpen(true);
        }
    }, [user]);

    const handleLoginCancel = () => {
        setIsLoginModalOpen(false);
        navigate('/events');
    };

    const handleClick = () => {
        setIsModalOpen(false);
        navigate('/');
    };

    const createRegistrationData = (data: RegistrationFormData): EventRegistrationData => {
        return {
            status: 'PENDING',
            cancelled: false,
            attendanceReason: data.hopes || '',
            expectation: data.additionalInfo || '',
            interestField: data.interestedField || '',
            registrationDate: new Date().toISOString(),
        };
    };

    const handleLoginConfirm = () => {
        const eventDetails = {
            eventId,
            title: state?.title,
            location: state?.location,
            imageUrl: state?.imageUrl,
            author: state?.author,
            eventRoom: state?.eventRoom,
            date: state?.date,
        };

        setIsLoginModalOpen(false);

        localStorage.setItem('pendingEventRegistration', JSON.stringify(eventDetails));

        navigate('/login', {
            state: {
                returnUrl: location.pathname,
                eventDetails,
            },
        });
    };

    const onSubmit: SubmitHandler<RegistrationFormData> = async (data) => {
        if (isSubmitting) return;

        if (!user) {
            setIsLoginModalOpen(true);
            return;
        }

        try {
            setIsSubmitting(true);

            if (!user) {
                messageApi.error('You need to be logged in to register for the event.');
                navigate('/login');
                return;
            }

            const registrationData = createRegistrationData(data);
            const response = await registerEventService.registerEvent(eventId || '', registrationData);

            handleRegistrationResponse(response, setIsModalOpen, reset, setStep);
        } catch (error: unknown) {
            console.error('Error registering for event:', error);
            messageApi.error(error instanceof Error ? error.message : 'An error occurred. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRegistrationResponse = (
        response: ApiResponse<EventRegistrationResponse>,
        setIsModalOpen: (open: boolean) => void,
        reset: () => void,
        setStep: (step: number) => void,
    ) => {
        if (response.statusCode === 200 || response.statusCode === 201) {
            setIsModalOpen(true);
            reset();
            setStep(1);
        } else {
            messageApi.error(response.data?.message || response.message || 'Registration failed. Please try again.');
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
                'firstName',
                'lastName',
                'jobTitle',
                'experience',
                'email',
                'phone',
            ];

            const isStepValid = await trigger(fieldsToValidate, {
                shouldFocus: true,
            });

            fieldsToValidate.forEach((field) => {
                trigger(field);
            });

            if (!isStepValid) {
                return;
            }
        }

        if (step < 2) setStep(step + 1);
    };

    const { date: formattedDate } = formatDate(location.state?.date || 'No Date Found');

    return (
        <>
            {contextHolder}
            {user ? (
                <div
                    style={{
                        paddingTop:
                            window.innerWidth <= parseInt(themeColors.breakpoints.tablet)
                                ? themeColors.spacing.xxl
                                : '0',
                        paddingBottom: themeColors.spacing.xxxl,
                    }}
                >
                    <FormProvider {...methods}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <PageContainer>
                                <FormSection>
                                    <FormCard>
                                        <StepperContainer>
                                            <StepperWrapper>
                                                <Step step={1} currentStep={step} />
                                                <ProgressLine isCompleted={step > 1} />
                                                <Step step={2} currentStep={step} />
                                            </StepperWrapper>
                                        </StepperContainer>

                                        <FormContent>
                                            <EventForm currentStep={step} />
                                        </FormContent>

                                        <ButtonContainer>
                                            <ButtonWrapper>
                                                <Button
                                                    htmlType="reset"
                                                    size="sm"
                                                    variant="secondary"
                                                    onClick={handleBack}
                                                    disabled={step === 1}
                                                >
                                                    Back
                                                </Button>

                                                {step === 2 ? (
                                                    <Button
                                                        htmlType="submit"
                                                        size="sm"
                                                        variant="primary"
                                                        icon={<FaArrowUpRightFromSquare className="text-xs" />}
                                                        disabled={isSubmitting}
                                                    >
                                                        {isSubmitting ? 'Submitting' : 'Register'}
                                                    </Button>
                                                ) : (
                                                    <Button size="sm" variant="primary" onClick={handleNext}>
                                                        Continue
                                                    </Button>
                                                )}
                                            </ButtonWrapper>
                                        </ButtonContainer>
                                    </FormCard>
                                </FormSection>

                                <RightSideDetails
                                    imageSource={imageSource}
                                    title={title}
                                    formattedDate={formattedDate}
                                    organizer={organizer}
                                    eventLocation={eventLocation}
                                    eventRoom={eventRoom || 'Unknown'}
                                />
                            </PageContainer>
                        </form>
                    </FormProvider>
                </div>
            ) : (
                <PageContainer>
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                        <p>Please log in to register for this event.</p>
                    </div>
                </PageContainer>
            )}

            {isModalOpen && (
                <InfoModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title={t('successModal.title')}
                    message={t('successModal.message', {
                        title: methods.getValues('eventDetails.title'),
                    })}
                    buttonLabel="OK"
                    size="sm"
                    onConfirm={handleClick}
                />
            )}
            {isLoginModalOpen && (
                <ConfirmModal
                    isOpen={isLoginModalOpen}
                    onClose={handleLoginCancel}
                    onConfirm={handleLoginConfirm}
                    title="Login Required"
                    mainMessage="You need to be logged in to register for the event:"
                    highlightText={title}
                    confirmLabel="Continue"
                    cancelLabel="Cancel"
                    size="sm"
                />
            )}
        </>
    );
}
