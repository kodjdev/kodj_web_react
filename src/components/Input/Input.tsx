import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import theme from "@/tools/theme";

const InputContainer = styled.div<{ fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  margin-bottom: ${themeColor.spacing.lg};
  width: ${(props) => (props.fullWidth ? "100%" : "auto")};
`;

const Label = styled.label`
  color: ${themeColor.colors.gray.text};
  font-size: ${themeColor.typography.body.small.fontSize}px;
  margin-bottom: ${themeColor.spacing.xs};
`;

const StyledInput = styled.input`
  background-color: ${themeColor.colors.gray.inputTag};
  color: ${themeColor.colors.neutral.white};
  border: none;
  border-radius: ${themeColor.cardBorder.md};
  padding: ${themeColor.spacing.md};
  font-size: ${themeColor.typography.body.medium.fontSize}px;
  height: 48px;
  width: 100%;
  box-shadow: ${themeColor.shadows.inset.input.gray};

  &:focus {
    outline: none;
    box-shadow: ${themeColor.shadows.inset.input.purple};
  }

  &::placeholder {
    color: ${themeColor.colors.gray.text};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.span`
  color: ${themeColor.colors.status.error.text};
  font-size: ${themeColor.typography.body.xsmall.fontSize}px;
  margin-top: ${themeColor.spacing.xs};
`;


/**
 * Input component - Atom Component
 *
 * A form input control that combines multiple atomic elements (label, input field, and error message)
 * into a cohesive form control.
 *
 * @returns a styled input component with optional label and error message.
 * 
 */

export default function Input({
  label,
  error,
  fullWidth = false,
  ...rest
}: InputProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <InputContainer fullWidth={fullWidth}>
      {label && <Label>{label}</Label>}
      <StyledInput ref={inputRef} {...rest} />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </InputContainer>
  );
}

