interface FormData {
    name?: string;
    email?: string;
    zipCode?: string;
    communityIssue?: string;
    environmentalConcern?: string;
    personalImpact?: string;
    desiredOutcome?: string;
}

interface Recipient {
    title: string;
    name: string;
}

interface ContextMap {
    [key: string]: string;
}

export function createLetterPrompt(formData: FormData, recipient: Recipient): string {
    const {
        name = "Concerned Community Member",
        email = "",
        zipCode = "",
        communityIssue = "",
        environmentalConcern = "",
        personalImpact = "",
        desiredOutcome = ""
    } = formData;

    const concernContext = getConcernContext(environmentalConcern);

    const dataContext = "According to studies on environmental disparities, communities facing similar issues have experienced significant public health impacts. A data-driven approach to environmental protection is essential for identifying and addressing disproportionate burdens.";

    const roleSpecificRequests = getRoleBasedRequests(recipient.title, environmentalConcern);

    return `
  You are an environmental justice advocate assisting community members in crafting effective letters to government officials. Write a formal, persuasive, respectful letter to ${recipient.title} ${recipient.name} about an environmental justice concern. Use these specific details:
  
  SENDER INFORMATION:
  - Name: ${name}
  - Email: ${email || "[Will be added manually by sender]"}
  - ZIP Code: ${zipCode}
  
  ENVIRONMENTAL ISSUE:
  ${communityIssue || `Community concerns regarding ${environmentalConcern} in the ${zipCode} area`}
  
  SPECIFIC CONCERN:
  ${environmentalConcern}
  
  ${concernContext}
  
  ${dataContext}
  
  PERSONAL IMPACT:
  ${personalImpact || "This issue affects the health and wellbeing of our community members, particularly vulnerable populations including children, the elderly, and those with pre-existing health conditions."}
  
  DESIRED OUTCOME:
  ${desiredOutcome || getDefaultOutcome(environmentalConcern, recipient.title)}
  
  ${roleSpecificRequests}
  
  GUIDELINES:
  - Use a formal, professional, and respectful tone that acknowledges the official's role and responsibilities
  - Focus on environmental justice principles, emphasizing that all communities deserve equal protection from environmental hazards
  - Include 2-3 specific, actionable requests that are appropriate for the official's authority level
  - Reference any relevant local, state, or federal environmental regulations or laws if applicable
  - Balance emotional appeal with factual information to build a compelling case
  - Keep the letter between 400-500 words
  - Include appropriate opening and closing salutations
  - Format the letter professionally with proper spacing and paragraphs
  - Convey urgency while maintaining a collaborative tone
  - Offer to provide additional information or meet to discuss the issue further
  
  Do not include any placeholder text or notes about what should be included. Write the complete, ready-to-send letter.
  `;
}

function getConcernContext(environmentalConcern: string): string {
    const contextMap: ContextMap = {
        "air pollution from industrial facilities":
            "Air pollution from industrial sources is linked to increased rates of asthma, COPD, cardiovascular disease, and premature death. Environmental justice communities often bear a disproportionate burden of industrial air pollution due to historical zoning practices and lack of regulatory enforcement.",

        "water contamination":
            "Contaminated drinking water can contain harmful chemicals, heavy metals, or pathogens that lead to both acute and chronic health issues. Lower-income communities and communities of color often face higher risks of water contamination due to aging infrastructure, proximity to industrial sites, and delayed remediation efforts.",

        "toxic waste sites":
            "Proximity to toxic waste sites has been associated with increased cancer rates, developmental delays in children, and other serious health conditions. Studies show that toxic waste facilities are disproportionately sited in communities of color and low-income areas.",

        "lack of green spaces":
            "Research shows that access to green spaces improves physical and mental health outcomes. Many environmental justice communities have significantly less tree canopy coverage and park access, contributing to urban heat island effects and fewer opportunities for recreation and physical activity.",

        "flooding and poor drainage infrastructure":
            "Inadequate flood protection and stormwater management disproportionately impacts historically marginalized communities. Climate change is increasing the frequency and intensity of severe weather events, making resilient infrastructure a critical environmental justice issue.",

        "lead exposure":
            "Lead exposure, even at low levels, causes irreversible neurological damage, particularly in children. Lead contamination from aging housing stock, industrial sites, and water delivery systems continues to disproportionately affect low-income communities and communities of color.",

        "proposed industrial development":
            "New industrial developments must include robust environmental impact assessments that consider cumulative impacts on already overburdened communities. Environmental justice principles require meaningful involvement of potentially affected community members in decision-making processes."
    };

    return contextMap[environmentalConcern] ||
        "This environmental issue raises significant concerns about equitable protection from environmental hazards and meaningful involvement in environmental decision-making processes that affect community health and wellbeing.";
}

function getRoleBasedRequests(role: string, concern: string): string {
    if (role.toLowerCase().includes('mayor')) {
        return "ROLE-SPECIFIC CONTEXT: As the mayor, you have significant influence over local environmental priorities, enforcement of municipal codes, and community engagement processes. Your leadership can set a precedent for environmental justice in our community.";
    }

    if (role.toLowerCase().includes('council')) {
        return "ROLE-SPECIFIC CONTEXT: As a city council member, you have the power to propose and vote on ordinances that can protect our community from environmental hazards. You can also ensure that community voices are heard in development decisions.";
    }

    if (role.toLowerCase().includes('commissioner')) {
        return "ROLE-SPECIFIC CONTEXT: As a county commissioner, you oversee important decisions about land use, public health, and environmental protection at the county level. Your position allows you to advocate for policies that prevent disproportionate environmental burdens.";
    }

    if (role.toLowerCase().includes('representative')) {
        return "ROLE-SPECIFIC CONTEXT: As our state representative, you have the power to shape environmental legislation and advocate for adequate funding for environmental protection and remediation in our district. Your voice in the legislature can help ensure environmental justice principles are incorporated into state policies.";
    }

    return "ROLE-SPECIFIC CONTEXT: Your position gives you influence over decisions that affect environmental conditions in our community. Your leadership can help ensure that all community members have equal protection from environmental hazards.";
}

function getDefaultOutcome(concern: string, role: string): string {
    switch (concern) {
        case "air pollution from industrial facilities":
            return "increased monitoring of industrial emissions, stronger enforcement of Clean Air Act regulations, and community involvement in reviewing permit renewals";

        case "water contamination":
            return "comprehensive water quality testing, transparent public reporting of results, and immediate remediation of any identified contaminants";

        case "toxic waste sites":
            return "prioritized cleanup of existing contaminated sites, stricter oversight of waste disposal practices, and community input on remediation plans";

        case "lack of green spaces":
            return "equitable investment in parks and green infrastructure, with particular focus on historically underserved neighborhoods";

        case "flooding and poor drainage infrastructure":
            return "upgraded stormwater management systems, climate-resilient infrastructure investments, and equitable flood protection for vulnerable communities";

        case "lead exposure":
            return "systematic testing for lead hazards, funding for lead abatement programs, and strong enforcement of lead safety regulations";

        case "proposed industrial development":
            return "a comprehensive health impact assessment, meaningful community involvement in the decision-making process, and strong protections against additional pollution burden";

        default:
            return "policies and actions that ensure environmental protection for all community members, with special attention to historically marginalized populations";
    }
}