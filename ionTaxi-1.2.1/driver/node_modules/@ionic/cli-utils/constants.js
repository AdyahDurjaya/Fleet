"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CommandGroup;
(function (CommandGroup) {
    CommandGroup[CommandGroup["Deprecated"] = 0] = "Deprecated";
    CommandGroup[CommandGroup["Hidden"] = 1] = "Hidden";
})(CommandGroup = exports.CommandGroup || (exports.CommandGroup = {}));
var NamespaceGroup;
(function (NamespaceGroup) {
    NamespaceGroup[NamespaceGroup["Deprecated"] = 0] = "Deprecated";
    NamespaceGroup[NamespaceGroup["Hidden"] = 1] = "Hidden";
})(NamespaceGroup = exports.NamespaceGroup || (exports.NamespaceGroup = {}));
var OptionGroup;
(function (OptionGroup) {
    OptionGroup[OptionGroup["Advanced"] = 0] = "Advanced";
    OptionGroup[OptionGroup["AppScripts"] = 1] = "AppScripts";
    OptionGroup[OptionGroup["Cordova"] = 2] = "Cordova";
    OptionGroup[OptionGroup["Deprecated"] = 3] = "Deprecated";
    OptionGroup[OptionGroup["Hidden"] = 4] = "Hidden";
})(OptionGroup = exports.OptionGroup || (exports.OptionGroup = {}));
