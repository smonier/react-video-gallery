<%@ page language="java" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="template" uri="http://www.jahia.org/tags/templateLib" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="jcr" uri="http://www.jahia.org/tags/jcr" %>
<%@ taglib prefix="ui" uri="http://www.jahia.org/tags/uiComponentsLib" %>
<%@ taglib prefix="functions" uri="http://www.jahia.org/tags/functions" %>
<%@ taglib prefix="query" uri="http://www.jahia.org/tags/queryLib" %>
<%@ taglib prefix="utility" uri="http://www.jahia.org/tags/utilityLib" %>
<%@ taglib prefix="s" uri="http://www.jahia.org/tags/search" %>
<jsp:useBean id="random" class="java.util.Random" scope="application"/>

<%--Add files used by the webapp--%>
<template:addResources type="css" resources="reactVideoGallery-overrides.css"/>
<template:addResources type="javascript" resources="webapp/54.js"/>

<template:addResources type="javascript" resources="webapp/reactVideoGallery.js"/>
<template:addResources type="javascript" resources="webapp/reactVideoGallery-vendors.js"/>
<template:addResources type="javascript" resources="webapp/remoteEntry.js"/>



<c:set var="_uuid_" value="${currentNode.identifier}"/>
<c:set var="language" value="${currentResource.locale.language}"/>
<c:set var="workspace" value="${renderContext.workspace}"/>
<c:set var="isEdit" value="${renderContext.editMode}"/>

<c:set var="site" value="${renderContext.site.siteKey}"/>
<c:set var="host" value="${url.server}"/>

<c:set var="targetId" value="REACT_ReactVideoGallery_${fn:replace(random.nextInt(),'-','_')}"/>
<jcr:node var="user" path="${renderContext.user.localPath}"/>


<div id="${targetId}"></div>

<script>
    const reactVideoGallery_context_${targetId} = {
        host: "${host}",
        workspace: "${workspace}",
        isEdit:${isEdit},
        scope: "${site}",//site key
        locale: "${language}",
        reactVideoGalleryId: "${_uuid_}",
        gqlServerUrl: "${host}/modules/graphql",
        contextServerUrl: window.digitalData ? window.digitalData.contextServerPublicUrl : undefined
    };

    window.addEventListener("DOMContentLoaded", (event) => {
        const callServiceNowApp = () => {
            if (typeof window.reactVideoGalleryUIApp === 'function') {
                window.reactVideoGalleryUIApp("${targetId}", reactVideoGallery_context_${targetId});
            } else {
                console.error("Error: window.reactVideoGalleryUIApp is not defined or is not a function.");
            }
        };

        <c:choose>
            <c:when test="${isEdit}">
                setTimeout(callServiceNowApp, 500); // Delayed execution in edit mode
            </c:when>
            <c:otherwise>
                callServiceNowApp(); // Immediate execution in non-edit mode
            </c:otherwise>
        </c:choose>
    });
</script>

<c:if test="${renderContext.editMode}">
    <%--
    As only one child type is defined no need to restrict
    if a new child type is added restriction has to be done
    using 'nodeTypes' attribute
    --%>
    <template:module path="*"/>
</c:if>