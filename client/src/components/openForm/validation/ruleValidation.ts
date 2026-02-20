export type RuleToken = { name: string; param?: string | null };
export function parseRuleString(ruleString = ""): RuleToken[] {
    return String(ruleString || "")
        .split("|")
        .map((t) => t.trim())
        .filter(Boolean)
        .map((token) => {
            const [name, ...rest] = token.split(":");
            return {name, param: rest.length ? rest.join(":") : null};
        });
}


const isEmptyValue = (val: unknown) =>
    val === null ||
    val === undefined ||
    (typeof val === "string" && val.trim() === "") ||
    (Array.isArray(val) && val.length === 0);

export function validateSingleRule(ruleString: string, value: unknown, allValues: Record<string, unknown> = {}): string | null {
    const parsedRules = parseRuleString(ruleString)

    // @ts-ignore
    for (const token of parsedRules) {
        const r = token.name;
        const p = token.param ?? null;
        const empty = isEmptyValue(value);



        if (r === "nullable") continue;

        if (r === "required" || r === "required_if") {
            if (empty) return "required";
            continue;
        }
        if (r === "email") {
            if (empty) continue;
            const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value ?? ""));
            if (!ok) return "email";
            continue;
        }

        if (r === "numeric" || r === "integer") {
            if (empty) continue;
            const num = Number(value as any);
            if (value === "" || Number.isNaN(num)) return r;
            if (r === "integer" && !Number.isInteger(num)) return "integer";
            continue;
        }

        if (r === "digits") {
            if (empty) continue;
            const s = String(value ?? "");
            if (s.length !== Number(p)) return "digits";
            continue;
        }

        if (r === "size") {
            if (empty) continue;
            const s = String(value ?? "");
            if (s.length !== Number(p)) return "size";
            continue;
        }
        if (r === "min" || r === "max") {
            if (empty) continue;
            const paramNumeric = p !== null && !Number.isNaN(Number(p));
            if (paramNumeric) {
                const n = Number(value as any);
                if (Number.isNaN(n)) return "numeric";
                if (r === "min" && n < Number(p)) return "min";
                if (r === "max" && n > Number(p)) return "max";
            } else {
                const s = String(value ?? "");
                if (r === "min" && s.length < Number(p)) return "min";
                if (r === "max" && s.length > Number(p)) return "max";
            }
            continue;
        }

        if (r === "between" && p) {
            const [minvRaw, maxvRaw] = p.split(",").map((s) => s.trim());
            const minv = Number(minvRaw);
            const maxv = Number(maxvRaw);
            if (!Number.isNaN(minv) && !Number.isNaN(maxv)) {
                const num = Number(value as any);
                if (Number.isNaN(num) || num < minv || num > maxv) return "between";
            } else {
                const s = String(value ?? "");
                if (s.length < minv || s.length > maxv) return "between";
            }
            continue;
        }

        /*
        if (r === "date") {
            if (empty) continue;
            let valid = true;
            if (value instanceof Date) valid = !Number.isNaN(value.getTime());
            if (!valid) return "date";
            continue;
        }*/

        if (r === "confirmed") {
            const other = `${p ?? ""}`;
            if (value !== allValues[other]) return "confirmed";
            continue;
        }

        if (r === "same" && p) {
            if (value !== allValues[p]) return "same";
            continue;
        }

        if (r === "at_least_one" && p) {
            const keys = p.split(",");
            let atLeastOne = false;
            keys.forEach((key) => {
                if (allValues[key] == true){
                    atLeastOne = true;
                    return;
                }
            });

            if (atLeastOne) {
                continue;
            } else {
                return "at_least_one";
            }
        }

        if (r === "regex" && p) {
            let pattern = p;
            let flags = "";
            if (pattern.startsWith("/") && pattern.lastIndexOf("/") > 0) {
                const lastSlash = pattern.lastIndexOf("/");
                flags = pattern.slice(lastSlash + 1);
                pattern = pattern.slice(1, lastSlash);
            }
            try {
                const re = new RegExp(pattern, flags);
                if (!re.test(String(value ?? ""))) return "regex";
            } catch {
                // invalid regex: skip
            }
            continue;
        }

        if (r === "in" && p) {
            const list = p.split(",").map((s) => s.trim());
            if (!list.includes(String(value ?? ""))) return "in";
            continue;
        }
    }

    return null;
}
