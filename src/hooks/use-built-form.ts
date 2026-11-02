import { type Dispatch, type SetStateAction, useEffect, useRef, useState } from "react";

/**
 * A form that is in a page's built HTML, so a visitor can fill it in before React attaches: typing
 * on a slow connection, tapping autofill, or a browser restoring it. React leaves that text in the
 * fields but not in state, and the form's next render would then clear them. This copies it over
 * as the page attaches, by field id, so each field's id must be a key of the form's state. The
 * values are read here and set in one batch, because a render before state holds them loses them.
 *
 * canSubmit stays false until then, because a submit with no handler reloads the page and loses
 * what was typed. Disabling the submit button also stops Enter.
 */
export function useBuiltForm<T extends object>(setFormData: Dispatch<SetStateAction<T>>) {
  const formRef = useRef<HTMLFormElement>(null);
  const [canSubmit, setCanSubmit] = useState(false);

  useEffect(() => {
    const fields = formRef.current?.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("input[id], textarea[id]") ?? [];
    const entered = Object.fromEntries([...fields].filter((field) => field.value).map((field) => [field.id, field.value]));
    setFormData((current) => ({ ...current, ...entered }));
    setCanSubmit(true);
  }, [setFormData]);

  return { formRef, canSubmit };
}
