"use client";
import type { ChangeEvent } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import {
  API_URL,
  customerFetchInit,
  rememberCsrfFromAuthPayload,
} from "@/lib/api";
import { getCurrentCustomer } from "@/lib/auth";
import { formatUserError } from "@/lib/userError";

const ALERT_DURATION = 4000;
const DEFAULT_SUBMISSION_DELAY = 0;
const DEFAULT_MESSAGE_KEY = "message";

type ReservationAlertState = {
  type: "success" | "danger";
  message: string;
};

type ReservationSlot = {
  time: string;
  available: boolean;
};

export type ReservationFormData = {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: string;
  message: string;
  terms: boolean;
  marketing: boolean;
};

type ReservationCustomer = {
  token?: string;
  name?: string;
  email?: string;
  phone?: string;
};

type ReservationFieldEvent = ChangeEvent<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
>;

type ReservationMessageKey = "message" | "specialRequests";

interface UseReservationFormOptions {
  requireTerms?: boolean;
  submissionDelayMs?: number;
  messagePayloadKey?: ReservationMessageKey;
}

const createInitialFormData = (): ReservationFormData => ({
  name: "",
  email: "",
  phone: "",
  date: "",
  time: "",
  guests: "",
  message: "",
  terms: false,
  marketing: false,
});

export const useReservationForm = ({
  requireTerms = false,
  submissionDelayMs = DEFAULT_SUBMISSION_DELAY,
  messagePayloadKey = DEFAULT_MESSAGE_KEY,
}: UseReservationFormOptions = {}) => {
  const [formData, setFormData] = useState<ReservationFormData>(
    createInitialFormData(),
  );
  const [alert, setAlert] = useState<ReservationAlertState | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<ReservationSlot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [currentCustomer, setCurrentCustomer] =
    useState<ReservationCustomer | null>(null);

  const resetForm = useCallback(() => {
    setFormData(createInitialFormData());
  }, []);

  const focusField = useCallback((field: keyof ReservationFormData) => {
    const element = document.getElementById(field);
    element?.focus();
  }, []);

  const validateEmail = useCallback((email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }, []);

  const validatePhone = useCallback((phone: string): boolean => {
    const regex = /^[\d\s()+-]+$/;
    return regex.test(phone) && phone.replace(/\D/g, "").length >= 10;
  }, []);

  const handleInputChange = useCallback(
    (
      fieldOrEvent: keyof ReservationFormData | ReservationFieldEvent,
      value?: string | boolean,
    ) => {
      if (typeof fieldOrEvent === "string") {
        if (fieldOrEvent === "email" && currentCustomer?.token) return;
        setFormData((prev) => ({
          ...prev,
          [fieldOrEvent]: value ?? "",
        }));
      } else {
        const { name, type } = fieldOrEvent.target;
        const nextValue =
          type === "checkbox"
            ? (fieldOrEvent.target as HTMLInputElement).checked
            : fieldOrEvent.target.value;

        if (name === "email" && currentCustomer?.token) return;
        setFormData((prev) => ({
          ...prev,
          [name]: nextValue,
        }));
      }

      if (alert?.type === "danger") {
        setAlert(null);
      }
    },
    [alert?.type, currentCustomer?.token],
  );

  useEffect(() => {
    const customer = getCurrentCustomer() as ReservationCustomer | null;
    setCurrentCustomer(customer);
    if (!customer?.token) return;

    setFormData((prev) => ({
      ...prev,
      name: customer.name || prev.name,
      email: customer.email || prev.email,
      phone: customer.phone || prev.phone,
    }));

    fetch(
      `${API_URL}/customers/me`,
      customerFetchInit({ token: customer.token, cache: "no-store" }),
    )
      .then((r) => r.json())
      .then((json) => {
        rememberCsrfFromAuthPayload(json);
        const data = json?.data ?? {};
        setFormData((prev) => ({
          ...prev,
          name: data.name || prev.name,
          email: data.email || prev.email,
          phone: data.phone || prev.phone,
        }));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!alert) return;

    const timer = setTimeout(() => {
      setAlert(null);
    }, ALERT_DURATION);

    return () => clearTimeout(timer);
  }, [alert]);

  const availableTimes = useMemo(() => {
    return availableSlots
      .filter((slot) => slot.available)
      .map((slot) => slot.time);
  }, [availableSlots]);

  const currentTimeRef = useRef(formData.time);
  useEffect(() => {
    currentTimeRef.current = formData.time;
  }, [formData.time]);

  useEffect(() => {
    const dateStr = formData.date.trim();
    if (!dateStr) {
      setAvailableSlots([]);
      setIsLoadingSlots(false);
      return;
    }

    let cancelled = false;

    const load = async () => {
      setIsLoadingSlots(true);
      try {
        const res = await fetch(
          `${API_URL}/reservations/check/available-slots?date=${encodeURIComponent(
            dateStr,
          )}`,
          customerFetchInit({ cache: "no-store" }),
        );

        const json = await res.json().catch(() => null);
        if (cancelled) return;

        if (!res.ok || !json?.success) {
          setAvailableSlots([]);
          return;
        }

        const slots = Array.isArray(json?.data?.slots) ? json.data.slots : [];
        setAvailableSlots(slots);

        const time = currentTimeRef.current;
        if (
          time &&
          slots.length > 0 &&
          !slots.some(
            (slot: ReservationSlot) => slot?.available && slot?.time === time,
          )
        ) {
          setFormData((prev) => ({ ...prev, time: "" }));
        }
      } catch {
        if (!cancelled) setAvailableSlots([]);
      } finally {
        if (!cancelled) setIsLoadingSlots(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [formData.date]);

  const handleSubmit = useCallback(async () => {
    const trimmedData = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      date: formData.date.trim(),
      time: formData.time.trim(),
      guests: formData.guests.trim(),
      message: formData.message.trim(),
      terms: formData.terms,
      marketing: formData.marketing,
    };

    setAlert(null);

    if (!trimmedData.name) {
      setAlert({ type: "danger", message: "Name is required." });
      focusField("name");
      return;
    }

    if (trimmedData.name.length < 2) {
      setAlert({
        type: "danger",
        message: "Name must be at least 2 characters long.",
      });
      focusField("name");
      return;
    }

    if (!trimmedData.email) {
      setAlert({ type: "danger", message: "Email address is required." });
      focusField("email");
      return;
    }

    if (!validateEmail(trimmedData.email)) {
      setAlert({
        type: "danger",
        message: "Please enter a valid email address.",
      });
      focusField("email");
      return;
    }

    if (!trimmedData.phone) {
      setAlert({ type: "danger", message: "Phone number is required." });
      focusField("phone");
      return;
    }

    if (!validatePhone(trimmedData.phone)) {
      setAlert({
        type: "danger",
        message: "Please enter a valid phone number.",
      });
      focusField("phone");
      return;
    }

    if (!trimmedData.date) {
      setAlert({ type: "danger", message: "Reservation date is required." });
      focusField("date");
      return;
    }

    if (!trimmedData.time) {
      setAlert({ type: "danger", message: "Time is required." });
      focusField("time");
      return;
    }

    if (
      availableTimes.length > 0 &&
      !availableTimes.includes(trimmedData.time)
    ) {
      setAlert({
        type: "danger",
        message: "This time slot is not available. Please choose another time.",
      });
      focusField("time");
      return;
    }

    if (!trimmedData.guests) {
      setAlert({ type: "danger", message: "Number of guests is required." });
      focusField("guests");
      return;
    }

    if (requireTerms && !trimmedData.terms) {
      setAlert({
        type: "danger",
        message: "You must agree to the Terms of Service and Privacy Policy.",
      });
      return;
    }

    let parsedGuests = 1;
    if (trimmedData.guests.includes("+")) {
      parsedGuests = parseInt(trimmedData.guests.replace("+", ""), 10) || 5;
    } else {
      parsedGuests = parseInt(trimmedData.guests, 10) || 1;
    }

    const customer = currentCustomer;
    if (!customer?.token) {
      toast.error("Please login to make a reservation.", {
        autoClose: ALERT_DURATION,
      });
      resetForm();
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(
        `${API_URL}/reservations`,
        customerFetchInit({
          method: "POST",
          token: customer.token,
          body: JSON.stringify({
            name: trimmedData.name,
            email: trimmedData.email,
            phone: trimmedData.phone,
            date: trimmedData.date,
            time: trimmedData.time,
            numberOfGuests: parsedGuests,
            [messagePayloadKey]: trimmedData.message,
          }),
        }),
      );

      const json = await res.json().catch(() => ({}));
      if (
        !res.ok ||
        (json && typeof json === "object" && json.success === false)
      ) {
        const message =
          (json &&
            (json.message ||
              (Array.isArray(json.errors) ? json.errors.join(", ") : ""))) ||
          "Failed to submit reservation";
        throw new Error(message);
      }

      if (submissionDelayMs > 0) {
        await new Promise((resolve) => setTimeout(resolve, submissionDelayMs));
      }

      setAlert({
        type: "success",
        message:
          (json && json.message) ||
          "Your reservation has been submitted successfully!",
      });
      resetForm();
    } catch (error: unknown) {
      setAlert({
        type: "danger",
        message: formatUserError(error, "Failed to submit reservation"),
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [
    availableTimes,
    currentCustomer,
    formData,
    focusField,
    messagePayloadKey,
    requireTerms,
    resetForm,
    submissionDelayMs,
    validateEmail,
    validatePhone,
  ]);

  return {
    alert,
    availableTimes,
    currentCustomer,
    formData,
    handleInputChange,
    handleSubmit,
    isLoadingSlots,
    isSubmitting,
    setFormData,
    today: new Date().toISOString().split("T")[0],
  };
};

export type { ReservationAlertState, ReservationCustomer, ReservationSlot };
