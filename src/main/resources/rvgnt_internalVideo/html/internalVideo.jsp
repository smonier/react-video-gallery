<%@ page language="java" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="template" uri="http://www.jahia.org/tags/templateLib" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="jcr" uri="http://www.jahia.org/tags/jcr" %>

<c:set var="image" value="${currentNode.properties['videoPoster'].node}"/>
<template:module path='${image.url}' editable='false' view='hidden.contentURL' var="imageUrl"/>

<c:set var="caption" value="${currentNode.properties['jcr:title'].string}"/>
<c:set var="itemWidth" value="${currentNode.parent.properties['itemWidth'].string}"/>
<template:module path='${currentNode.properties.video.node.path}' editable='false' view='hidden.contentURL' var="videoURL"/>

<!-- Video Card -->
<div class="card video-card">
    <div class="card-body">
        <video class="img-fluid" width="100%" controls poster="${image.url}">
            <source src="${videoURL}" type="video/mp4">
        </video>
        <h5 class="card-title text-center mt-2">${caption}</h5>
    </div>
</div>
