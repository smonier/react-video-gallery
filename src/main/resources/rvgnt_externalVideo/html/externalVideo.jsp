<%@ page language="java" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="template" uri="http://www.jahia.org/tags/templateLib" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="jcr" uri="http://www.jahia.org/tags/jcr" %>

<c:set var="image" value="${currentNode.properties['videoPoster'].node}"/>

<c:set var="caption" value="${currentNode.properties['jcr:title'].string}"/>
<c:set var="itemWidth" value="${currentNode.parent.properties['itemWidth'].string}"/>
<c:set var="videoID" value="${currentNode.properties['videoId'].string}"/>
<c:set var="videoSource" value="${currentNode.properties['videoService'].string}"/>

<c:choose>
    <c:when test="${fn:toLowerCase(videoSource) == 'vimeo'}">
        <c:set var="videoURL" value="https://player.vimeo.com/video/${videoID}"/>
    </c:when>
    <c:when test="${fn:toLowerCase(videoSource) == 'wistia'}">
        <c:set var="videoURL" value="https://fast.wistia.net/embed/iframe/${videoID}"/>
    </c:when>
    <c:when test="${fn:toLowerCase(videoSource) == 'storylane'}">
        <c:set var="videoURL" value="https://jahia.storylane.io/demo/${videoID}?embed=inline"/>
    </c:when>
    <c:otherwise>
        <c:set var="videoURL" value="https://www.youtube.com/embed/${videoID}"/>
    </c:otherwise>
</c:choose>

<!-- Video Display -->
<div class="card video-card">
    <div class="card-body">
        <iframe class="embed-responsive-item" width="100%" height="315" src="${videoURL}" allowfullscreen></iframe>
        <h5 class="card-title text-center mt-2">${caption}</h5>
    </div>
</div>
